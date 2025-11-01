import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-bottom bg-[url(https://media.istockphoto.com/id/1195574796/photo/online-mobile-application-taxi-ordering-service-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=IFavci-tM-LcddRv9hLjgOB7QzFu2QdNb_b_0AW4zDY=)] h-screen flex pt-8  justify-between flex-col w-full bg-red-400'>
        <img className='w-14 ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="raahi" />
        <div className='bg-white pb-7 py-5 px-10'>
            <h2 className='text-2xl font-bold'>
                Get Started with Raahi
            </h2>
            <Link to='/login' className='flex item-center justify-center w-full bg-black text-white py-3 rounded mt-5 '>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start
