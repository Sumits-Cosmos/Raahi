import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainsDetails from '../components/CaptainsDetails'
import RidePopup from '../components/RidePopup'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import ConfirmedRidePannel from '../components/ConfirmedRidePannel'

const CaptainHome = () => {
  const [RidePopupPannel, setRidePopupPannel] = useState(true);
  const RidePopupRef = useRef(null);
  const [confirmedRidePanel, setConfirmedRidePanel] =  useState(false);
  const confirmedRidePanelRef = useRef(null);

  useGSAP(() => {
    gsap.to(RidePopupRef.current, {
      transform: RidePopupPannel ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [RidePopupPannel]);

    useGSAP(() => {
    gsap.to(confirmedRidePanelRef.current, {
      transform: confirmedRidePanel ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [confirmedRidePanel]);

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
      <div className='h-2/5 p-6'>
        <CaptainsDetails/>
      </div>

      <div ref={RidePopupRef}  className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 transalte-y-full bottom-0 pt-12'>
       <RidePopup setRidePopupPannel= {setRidePopupPannel} setConfirmedRidePanel= {setConfirmedRidePanel}/>
      </div>
      <div ref={confirmedRidePanelRef}  className='fixed z-10 h-screen w-full bottom-0 bg-white px-3 py-16 transalte-y-full bottom-0 pt-12'>
       <ConfirmedRidePannel setConfirmedRidePanel= {setConfirmedRidePanel} setRidePopupPannel= {setRidePopupPannel}/>
      </div>
    </div>
  )
}

export default CaptainHome
