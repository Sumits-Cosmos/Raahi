import React, { useState } from 'react'
import axios from 'axios'

const LookingForDriver = ({ setVehicleFound, setVehicleWaiting, ride, pickup, destination, fare, vehicleType }) => {
  const [isCancelling, setIsCancelling] = useState(false);

  if (!ride) {
    return null;
  }

  const handleCancelRide = async () => {
    if (!ride?._id) {
      setVehicleFound(false);
      return;
    }

    if (window.confirm('Are you sure you want to cancel this ride request?')) {
      setIsCancelling(true);
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`,
          { rideId: ride._id, reason: 'Rider cancelled while searching' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } catch (err) {
        console.error('Error cancelling ride:', err);
      } finally {
        setIsCancelling(false);
        setVehicleFound(false);
        if (setVehicleWaiting) setVehicleWaiting(false);
      }
    }
  };

  const fareDisplay = fare && vehicleType && fare[vehicleType] ? fare[vehicleType] : ride?.fare || 'N/A';

  return (
    <div>
      <h5 onClick={() => setVehicleFound(false)} className='p-3 w-[93%] text-center absolute top-0 cursor-pointer'>
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <h2 className='text-2xl font-bold mb-4 text-gray-900'>Looking For Captains Nearby</h2>
      
      {/* OTP Display Section */}
      <div className='bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-4 text-center shadow-sm'>
        <p className='text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1'>Your Ride OTP</p>
        <h3 className='text-4xl font-extrabold text-yellow-600 tracking-widest font-mono'>{ride.otp}</h3>
        <p className='text-xs text-gray-500 mt-1'>Share this with your captain when they arrive</p>
      </div>

      <div className='flex flex-col justify-between items-center gap-2'>
        <div className='w-full divide-y divide-gray-100'>
          <div className='flex items-start gap-4 py-3'>
            <i className="text-xl text-green-600 ri-map-pin-fill mt-0.5"></i>
            <div>
              <h3 className='text-sm font-bold text-gray-800'>Pickup</h3>
              <p className='text-xs text-gray-600 line-clamp-1'>{pickup || ride?.pickup}</p>
            </div>
          </div>
          <div className='flex items-start gap-4 py-3'>
            <i className="text-xl text-red-600 ri-map-pin-2-fill mt-0.5"></i>
            <div>
              <h3 className='text-sm font-bold text-gray-800'>Destination</h3>
              <p className='text-xs text-gray-600 line-clamp-1'>{destination || ride?.destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 py-3'>
            <i className="text-xl text-yellow-500 ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className='text-base font-extrabold text-gray-900'>₹{fareDisplay}</h3>
              <p className='text-xs text-gray-500'>Estimated Fare</p>
            </div>
          </div>
        </div>
  
        <div className='w-full mt-4 text-center'>
          <p className='text-gray-600 text-sm font-semibold'>Connecting with nearby captains...</p>
          <div className='flex justify-center gap-1.5 mt-2'>
            <div className='w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce'></div>
            <div className='w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
            <div className='w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></div>
          </div>

          <button
            type='button'
            disabled={isCancelling}
            onClick={handleCancelRide}
            className='mt-6 w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 rounded-xl transition-all disabled:opacity-50'
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Ride Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LookingForDriver
