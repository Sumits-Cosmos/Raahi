import React from 'react'

const LookingForDriver = (props) => {
  return (
<div>
      <h5 onClick={() => {
        props.setVehicleFound(close);
      }} 
      className='p-3 w-[93%] text-center absolute top-0'>
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <h2 className='text-2xl font-semibold mb-4'>Looking For a Rider</h2>
      <div className='flex flex-col justify-between items-center gap-2'>
        <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Car" />  
        <div className='w-full mt-5'>
          <div className='flex item-center gap-4 mb-3 p-3 border-b-1'>
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>657/11-B</h3>
              <p className='text-sm -mt-1 text-gray-600'>Channasandra, Bangalore, Karnataka</p>
            </div>
          </div>
          <div className='flex item-center gap-4 mb-3 p-3 border-b-1 '>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>657/11-B</h3>
              <p className='text-sm -mt-1 text-gray-600'>Channasandra, Bangalore, Karnataka</p>
            </div>
          </div>
          <div className='flex item-center gap-4 mb-3  p-3 '>
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>₹193.50</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
  
        <button onClick = {() => {
          props.setVehicleWaiting(true);
          props.setVehicleFound(false);
        }}
        className='w-full bg-green-600 font-semibold p-2 rounded-lg mt-5'>Confirm your Ride</button>

      </div>
    </div>
  )
}

export default LookingForDriver
