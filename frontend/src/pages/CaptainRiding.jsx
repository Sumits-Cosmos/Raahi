import React from 'react'
import { Link } from 'react-router-dom'

const CaptainRiding = () => {
  return (
<div className='h-screen'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-full'>
      <Link to = '/'>
        <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="raahi"/>
      </Link>
      <Link to= '/home' className='fixed h-10 w-10 block right-2 top-2 bg-white flex items-center justify-center rounded-full'>
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>
      </div>
      <div className='h-3/5'>
         <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="HardCoded-map" />
      </div>
      <div className='flex items-center justify-between bg-yellow-300 rounded-xl p-3 mt-4'>
        <div className='flex items-center gap-3'>
          <img className='h-12 w-12 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
          <h2 className='text-lg font-semibold'>Sumit Raj</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 KM</h5>
      </div>
      <div className='flex flex-col justify-between items-center gap-2 p-3'> 
              <div className='w-full mt-5'>
                <div className='flex item-center gap-4 mb-3 p-3 border-b-1 '>
                  <i className="text-lg ri-map-pin-2-fill"></i>
                  <div>
                    <h2 className='text-lg font-semibold'>Drop Location</h2>
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
        
             
      
            </div>
      
    </div>
  )
}

export default CaptainRiding
