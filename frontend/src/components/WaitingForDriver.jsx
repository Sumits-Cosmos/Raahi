import React, { useState } from 'react'
import axios from 'axios'

const WaitingForDriver = ({ setVehicleWaiting, ride }) => {
  const [isCancelling, setIsCancelling] = useState(false);

  if (!ride) {
    return null;
  }

  // Check if ride has started (OTP verified by captain)
  const rideStarted = ride.status === 'ongoing' && ride.captain;
  const captainName = ride.captain?.fullName?.firstName
    ? `${ride.captain.fullName.firstName} ${ride.captain.fullName.lastName || ''}`
    : 'Your Captain';

  const pickup = ride?.pickup || 'Pickup location';
  const destination = ride?.destination || 'Destination';
  const fare = ride?.fare || 'N/A';
  const vehicleType = ride.captain?.vehicle?.vehicleType?.toUpperCase() || 'VEHICLE';
  const numberPlate = ride.captain?.vehicle?.numberPlate || '';

  const handleCancelRide = async () => {
    if (!ride?._id) {
      setVehicleWaiting(false);
      return;
    }

    if (window.confirm('Are you sure you want to cancel this ride?')) {
      setIsCancelling(true);
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`,
          { rideId: ride._id, reason: 'Rider cancelled before trip started' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } catch (err) {
        console.error('Error cancelling ride in WaitingForDriver:', err);
      } finally {
        setIsCancelling(false);
        setVehicleWaiting(false);
      }
    }
  };

  return (
    <div>
      <h5 onClick={() => setVehicleWaiting(false)} className='p-3 w-[93%] text-center absolute top-0 cursor-pointer'>
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <h2 className='text-2xl font-bold mb-4 text-gray-900'>
        {rideStarted ? 'Ride in Progress' : 'Captain Matched!'}
      </h2>

      {/* OTP Display Section */}
      {!rideStarted && (
        <div className='bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-4 text-center shadow-sm'>
          <p className='text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1'>Share OTP with Captain</p>
          <h3 className='text-4xl font-extrabold text-yellow-600 tracking-widest font-mono'>{ride.otp}</h3>
          <p className='text-xs text-gray-500 mt-1'>Captain is on the way to your pickup</p>
        </div>
      )}

      {/* Captain Card */}
      <div className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-3.5 mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold'>
            {ride.captain?.fullName?.firstName?.charAt(0) || 'C'}
          </div>
          <div>
            <h3 className='text-base font-bold text-gray-900'>{captainName}</h3>
            <p className='text-xs font-semibold text-gray-500'>{vehicleType} {numberPlate ? `• ${numberPlate}` : ''}</p>
          </div>
        </div>
        <div className='text-right'>
          <span className='bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full'>
            {ride.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Trip Details */}
      <div className='flex flex-col justify-between items-center gap-2'>
        <div className='w-full divide-y divide-gray-100'>
          <div className='flex items-start gap-4 py-2.5'>
            <i className="text-xl text-green-600 ri-map-pin-fill mt-0.5"></i>
            <div>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Pickup</h3>
              <p className='text-sm text-gray-800 font-medium line-clamp-1'>{pickup}</p>
            </div>
          </div>
          <div className='flex items-start gap-4 py-2.5'>
            <i className="text-xl text-red-600 ri-map-pin-2-fill mt-0.5"></i>
            <div>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Destination</h3>
              <p className='text-sm text-gray-800 font-medium line-clamp-1'>{destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 py-2.5'>
            <i className="text-xl text-yellow-500 ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className='text-base font-bold text-gray-900'>₹{fare}</h3>
              <p className='text-xs text-gray-500'>Cash / UPI Payment on completion</p>
            </div>
          </div>
        </div>

        {!rideStarted && (
          <button
            type='button'
            disabled={isCancelling}
            onClick={handleCancelRide}
            className='mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm'
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Ride'}
          </button>
        )}
      </div>
    </div>
  )
}

export default WaitingForDriver
