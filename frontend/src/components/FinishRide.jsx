import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FinishRidePanel = ({ ride, setFinishRidePannel }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const userName = ride?.user?.fullName?.firstName && ride?.user?.fullName?.lastName
    ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName}`
    : ride?.user?.email || 'Rider';
  const pickupAddress = ride?.pickup || 'Unknown pickup';
  const distance = ride?.distance || 'N/A';
  const fareValue = ride?.fare || 'N/A';

  const handleFinishRide = async () => {
    if (!ride?._id) {
      alert('No active ride to complete.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ [FinishRide] Ride completed:', response.data);
      setFinishRidePannel(false);
      navigate('/captain-home');
    } catch (err) {
      console.error('❌ [FinishRide ERROR]:', err);
      setError(err.response?.data?.message || 'Failed to complete ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h5 onClick={() => {
        setFinishRidePannel(false); 
      }} 
      className='p-3 w-[93%] text-center absolute top-0 cursor-pointer'>
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <h2 className='text-2xl font-semibold mb-4'>Finish the Ride</h2>
      
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-3 text-sm'>
          {error}
        </div>
      )}

      <div className='flex items-center justify-between border-2 border-yellow-300 rounded-xl p-4 mt-4'>
        <div className='flex items-center gap-3'>
          <img className='h-12 w-12 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
          <h2 className='text-lg font-semibold'>{userName}</h2>
        </div>
        <h5 className='text-lg font-semibold'>{distance} KM</h5>
      </div>

      <div className='flex flex-col justify-between items-center gap-2'> 
        <div className='w-full mt-5'>
          <div className='flex items-center gap-4 mb-3 p-3 border-b-1'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{pickupAddress}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Pickup location</p>
            </div>
          </div>
          <div className='flex items-center gap-4 mb-3 p-3'>
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{fareValue}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Ride fare</p>
            </div>
          </div>
        </div>

        <div className='mt-6 w-full'>
          <button 
            type='button'
            disabled={isLoading}
            onClick={handleFinishRide}
            className='flex w-full mt-5 text-lg justify-center bg-green-600 hover:bg-green-700 active:scale-95 transition-all rounded-xl p-3 font-semibold text-white disabled:opacity-50'
          >
            {isLoading ? 'Completing Ride...' : 'Complete & Collect Payment'}
          </button>
          <p className='text-gray-500 text-xs mt-4 text-center'>
            Ensure the cash is collected or digital payment is confirmed before completing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinishRidePanel
