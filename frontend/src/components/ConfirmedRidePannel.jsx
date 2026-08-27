import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmedRidePannel = ({ ride, setConfirmedRidePanel, setRidePopupPannel }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    console.log('🔐 [verifyOTP] Form submitted, OTP input:', otp);

    if (!otp || otp.length !== 6) {
      console.error('❌ [verifyOTP] Invalid OTP length:', otp?.length || 0);
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    console.log('📤 [verifyOTP] Sending to backend: rideId=', ride._id, 'otp=', otp);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/verify-otp`,
        {
          rideId: ride._id,
          otp: otp
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ [verifyOTP] Backend response:', response.data);
      
      // Get the ride data from response
      const verifiedRideData = response.data.ride || response.data;
      console.log('📍 [verifyOTP] Verified ride data:', verifiedRideData);
      
      // Reset panels
      console.log('📍 [verifyOTP] Closing panels');
      setConfirmedRidePanel(false);
      setRidePopupPannel(false);
      
      // Navigate to captain-riding with verified ride data
      console.log('🚗 [verifyOTP] Navigating to captain-riding with ride data');
      setTimeout(() => {
        alert('OTP verified! Ride started.');
        navigate('/captain-riding', { state: { ride: verifiedRideData } });
      }, 300);
    } catch (err) {
      console.error('❌ [verifyOTP ERROR] Response:', err.response?.data);
      console.error('   Message:', err.message);
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const userName = ride?.user?.fullName?.firstName && ride?.user?.fullName?.lastName
    ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName}`
    : ride?.user?.email || 'Rider';
  const pickupAddress = ride?.pickup || 'Unknown pickup';
  const fareValue = ride?.fare || 'N/A';
  const distance = ride?.distance || 'N/A';

  return (
     <div>
      <h5 onClick={() => {
        setRidePopupPannel(false);
      }} 
      className='p-3 w-[93%] text-center absolute top-0'>
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <h2 className='text-2xl font-semibold mb-4'>Confirm Ride to Start</h2>
      <div className='flex items-center justify-between bg-yellow-300 rounded-xl p-3 mt-4'>
        <div className='flex items-center gap-3 '>
          <img className='h-12 w-12 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
          <h2 className='text-lg font-semibold'>{userName}</h2>
        </div>
        <h5 className='text-lg font-semibold'>{distance} KM</h5>
      </div>
      <div className='flex flex-col justify-between items-center gap-2'> 
        <div className='w-full mt-5'>

          <div className='flex item-center gap-4 mb-3 p-3 border-b-1 '>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{pickupAddress}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Pickup location</p>
            </div>
          </div>
          <div className='flex item-center gap-4 mb-3  p-3 '>
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{fareValue}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Estimated fare</p>
            </div>
          </div>
        </div>

  
        <div className='mt-6 w-full '>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              {error}
            </div>
          )}
          
          <form onSubmit={submitHandler}>
            <input 
              onChange={(e) => setOtp(e.target.value)} 
              value={otp}
              type="text" 
              placeholder='Enter 6-digit OTP'
              maxLength='6'
              disabled={isLoading}
              className='bg-[#eee] px-6 py-4 text-lg rounded-lg w-full font-mono mt-2 text-lg placeholder:text-base disabled:opacity-50'
            />
            
            <button 
              type='submit'
              disabled={isLoading}
              className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Verifying...' : 'Confirm'}
            </button>

            <button 
              type='button'
              onClick={() => {
                setConfirmedRidePanel(false);
                setRidePopupPannel(false);
              }}
              disabled={isLoading}
              className='w-full bg-red-600 text-lg text-white font-semibold p-2 rounded-lg mt-5 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default ConfirmedRidePannel
