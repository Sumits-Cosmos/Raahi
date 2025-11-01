import React, {use, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {useGSAP} from  '@gsap/react'
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmedRide from '../components/ConfirmedRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForRider from '../components/WaitingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';


const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] =  useState(false);
  const vehiclePanelRef = useRef(null);
  const [confirmedRidePanel, setConfirmedRidePanel] =  useState(false);
  const confirmedRidePanelRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const vehicleFoundRef = useRef(null);
  const [vehicleWaiting, setVehicleWaiting] = useState(false);
  const vehicleWaitingRef = useRef(null);

  const submitHandler = (e) => {
   e.preventDefault();
  }

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '70%' : '0%',
      opacity: panelOpen ? 1 : 0,
      padding: panelOpen ? 24 : 0,
    })
    gsap.to(panelCloseRef.current,{
      opacity: panelOpen ? 1 : 0,
    })
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmedRidePanelRef.current, {
      transform: confirmedRidePanel ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [confirmedRidePanel]);

  useGSAP(() => {
  gsap.to(vehicleFoundRef.current, {
    transform: vehicleFound ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [vehicleFound]);

  useGSAP(() => {
  gsap.to(vehicleWaitingRef.current, {
    transform: vehicleWaiting ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [vehicleWaiting]);

  return (
    <div className='h-screen relative overflow-hidden'>
      <Link to = '/'>
        <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="raahi"/>
      </Link>
      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="HardCoded-map" />
      </div>
      <div className='flex flex-col justify-end h-screen absolute top-0 w-full '>
       <div className='h-[30%] p-6 bg-white relative'>
        <h2 className='text-2xl font-semibold'>Find a trip</h2>
        <h2 className='absolute opacity-0 top-5 right-6 text-2xl'
          ref={panelCloseRef}
          onClick={() => {setPanelOpen(false)}}
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h2>
        <form className='relative py-3'
        onSubmit={(e) => {
          submitHandler();
        }}>
          <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
          <input
            value={pickup} 
            onChange={(e) => {
              setPickup(e.target.value)
            }}
            onClick={()=> {
              setPanelOpen(true)
            }}
            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3 placeholder:text-base' type="text" placeholder='Add a pickup location'/>
          <input 
            value={destination}
            onChange={()=> {
              setDestination(e.target.value)
            }}
            onClick={()=> {
              setPanelOpen(true)
            }}
            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3 text-lg placeholder:text-base' type="text" placeholder='Enter your destination'/>
        </form>
       </div>
        <div ref={panelRef} className='h-0  bg-white'>
            <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel= {setVehiclePanel}/>
        </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 translate-y-full bottom-0 pt-12'>
        <VehiclePanel setConfirmedRidePanel={setConfirmedRidePanel} setVehiclePanel={setVehiclePanel}/>
      </div>
       <div ref={confirmedRidePanelRef} className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 translate-y-full bottom-0 pt-12'>
        <ConfirmedRide setConfirmedRidePanel={setConfirmedRidePanel} setVehicleFound={setVehicleFound} />
      </div>
       
      <div ref={vehicleFoundRef}  className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 translate-y-full bottom-0 pt-12'>
        <LookingForDriver setVehicleFound={setVehicleFound} setVehicleWaiting = {setVehicleWaiting} />
      </div>

      <div ref={vehicleWaitingRef}  className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 translate-y-full bottom-0 pt-12'>
        <WaitingForDriver setVehicleWaiting={setVehicleWaiting} />
      </div>

    </div>
  )
}

export default Home
