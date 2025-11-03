import React from 'react'

const RidePopup = (props) => {
  return (
    <div>
      <h5 onClick={() => {
        props.setRidePopupPannel(close);
      }} 
      className='p-3 w-[93%] text-center absolute top-0'>
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <h2 className='text-2xl font-semibold mb-4'>New Ride Available</h2>
      <div className='flex items-center justify-between bg-yellow-300 rounded-xl p-3 mt-4'>
        <div className='flex items-center gap-3 '>
          <img className='h-12 w-12 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
          <h2 className='text-lg font-semibold'>Sumit Raj</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 KM</h5>
      </div>
      <div className='flex flex-col justify-between items-center gap-2'> 
        <div className='w-full mt-5'>

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
  
        <button onClick={() => {
          props.setConfirmedRidePanel(true);
        }}
        className='w-full bg-green-600 text-white font-semibold p-2 rounded-lg mt-5'>Accept</button>
               <button onClick={() => {
          props.setRidePopupPannel(false);
         
        }}
        className='w-full bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg mt-1'>Ignore</button>

      </div>
    </div>
  )
}

export default RidePopup
