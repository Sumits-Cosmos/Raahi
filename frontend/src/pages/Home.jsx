import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmedRide from '../components/ConfirmedRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveMap from '../components/LiveMap';
import axios from 'axios'
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/userContext';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const vehiclePanelRef = useRef(null);
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false);
  const confirmedRidePanelRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const vehicleFoundRef = useRef(null);
  const [vehicleWaiting, setVehicleWaiting] = useState(false);
  const vehicleWaitingRef = useRef(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null)
  const [ride, setRide] = useState(null)

  // Map state
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [captainLocation, setCaptainLocation] = useState(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    if (socket && user && user._id) { 
        console.log("Emitting 'join' with valid user ID:", user._id); 
        socket.emit("join", { userType: "user", userId: user._id })
    } else {
      console.log("Waiting for user ID... Current user:", user);
    }
  }, [user, socket])

  // Listen for ride-confirmed event
  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (rideData) => {
      console.log('✅ [ride-confirmed EVENT RECEIVED] Data:', rideData);
      setVehicleFound(false);
      setVehicleWaiting(true);
      setRide(rideData);

      // If captain has initial location coordinates
      if (rideData?.captain?.location?.coordinates) {
        setCaptainLocation({
          latitude: rideData.captain.location.coordinates[1],
          longitude: rideData.captain.location.coordinates[0],
          heading: 0,
          vehicleType: rideData.captain?.vehicle?.vehicleType || 'car'
        });
      }
    }

    socket.on('ride-confirmed', handleRideConfirmed);
    return () => socket.off('ride-confirmed', handleRideConfirmed);
  }, [socket])

  // Listen for live driver location stream
  useEffect(() => {
    if (!socket) return;

    const handleDriverLocation = (data) => {
      console.log('📍 [driver-location-update RECEIVED]', data);
      if (data && data.location) {
        setCaptainLocation({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          heading: data.location.heading || 0,
          vehicleType: ride?.captain?.vehicle?.vehicleType || vehicleType || 'car'
        });
      }
    };

    socket.on('driver-location-update', handleDriverLocation);
    return () => socket.off('driver-location-update', handleDriverLocation);
  }, [socket, ride, vehicleType]);

  // Listen for ride-started event (OTP verified by captain)
  useEffect(() => {
    if (!socket) return;

    const handleRideStarted = (rideData) => {
      console.log('🚗 [ride-started EVENT RECEIVED]', rideData);
      setRide(rideData);
      
      // Transition immediately to the live Riding view
      navigate('/riding', {
        state: {
          ride: rideData,
          routeCoordinates,
          pickupCoords,
          destinationCoords,
          pickup,
          destination
        }
      });
    };

    socket.on('ride-started', handleRideStarted);
    return () => socket.off('ride-started', handleRideStarted);
  }, [socket, navigate, routeCoordinates, pickupCoords, destinationCoords, pickup, destination])

  const handlePickupChange = async (e) => {
    const value = e.target.value
    setPickup(value)
    if (value.length < 3) {
      setPickupSuggestions([]);
      return;   
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`,{
        params: {text: e.target.value},
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setPickupSuggestions(response.data)
    } catch(err) {
      console.error(err)
    }
  }

  const handleDestinationChange = async (e) => {
    const value = e.target.value
    setDestination(value)
    if (value.length < 3) {
      setDestinationSuggestions([]);
      return;   
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`, {
        params: { text: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestinationSuggestions(response.data)
    } catch(err) {
      console.error(err);
    }
  }

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
      transform: vehicleFound ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5
    })
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(vehicleWaitingRef.current, {
      transform: vehicleWaiting ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5
    })
  }, [vehicleWaiting]);

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
    if (routes[index]) {
      setRouteCoordinates(routes[index].coordinates || []);
    }
  };

  async function findTrip(){
    setVehiclePanel(true)
    setPanelOpen(false)

    try {
      // Fetch dynamic fare estimate with surge breakdown
      const fareResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFare(fareResponse.data);

      // Fetch smart multi-route alternatives and turn steps
      const routeResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-route`, {
        params: { origin: pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (routeResponse.data) {
        const fetchedRoutes = routeResponse.data.routes || [];
        setRoutes(fetchedRoutes);
        setSelectedRouteIndex(0);
        setRouteCoordinates(routeResponse.data.coordinates || []);
        setPickupCoords(routeResponse.data.pickupCoords || null);
        setDestinationCoords(routeResponse.data.destinationCoords || null);
      }
    } catch (err) {
      console.error('Error fetching fare and route in findTrip:', err);
    }
  }

  async function createRide(){
    console.log("🚀 [createRide START] Creating ride with: ", { pickup, destination, vehicleType });

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`,{
        pickup,
        destination,
        vehicleType
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })  
      
      setRide(response.data);
      setVehicleFound(true);
      setVehicleWaiting(false);
      setConfirmedRidePanel(false);
    } catch (err) {
      console.error('❌ [createRide ERROR]:', err);
      alert('Failed to create ride. Please try again.');
    }
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      <Link to = '/'>
        <img className='w-16 absolute left-5 top-5 z-[500]' src="RaahiLogo.png" alt="raahi"/>
      </Link>
      <div className='h-screen w-screen'>
        <LiveMap
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          routeCoordinates={routeCoordinates}
          routes={routes}
          selectedRouteIndex={selectedRouteIndex}
          onSelectRoute={handleSelectRoute}
          captainLocation={captainLocation}
          vehicleType={vehicleType}
        />
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
          submitHandler(e);
        }}>
          <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
          <input
            value={pickup} 
            onChange={handlePickupChange}
            onClick={()=> {
              setPanelOpen(true)
              setActiveField('pickup')
            }}
            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3 placeholder:text-base' type="text" placeholder='Add a pickup location'/>
          <input 
            value={destination}
            onChange={handleDestinationChange}
            onClick={()=> {
              setPanelOpen(true)
              setActiveField('destination')
            }}
            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3 text-lg placeholder:text-base' type="text" placeholder='Enter your destination'/>
        </form>
        <button onClick={findTrip} 
         className="bg-black text-white px-12 py-2 text-lg rounded-lg w-full mt-3">
          Find Trip
        </button>
       </div>
        <div ref={panelRef} className='h-0  bg-white'>
            <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen} setVehiclePanel= {setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField} 
            />
        </div>
      </div>

      <div 
        ref={vehiclePanelRef} 
        style={{ display: vehiclePanel ? 'block' : 'none' }}
        className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 pt-12 shadow-2xl rounded-t-3xl'
      >
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmedRidePanel={setConfirmedRidePanel} setVehiclePanel={setVehiclePanel}/>
      </div>

      <div 
        ref={confirmedRidePanelRef} 
        style={{ display: confirmedRidePanel ? 'block' : 'none' }}
        className='fixed z-10 w-full bottom-0 bg-white px-3 py-16 pt-12 shadow-2xl rounded-t-3xl'
      >
        <ConfirmedRide fare={fare} vehicleType={vehicleType} pickup={pickup} destination={destination} createRide={createRide} setConfirmedRidePanel={setConfirmedRidePanel} setVehicleFound={setVehicleFound} />
      </div>
       
      <div 
        ref={vehicleFoundRef}  
        style={{ display: vehicleFound ? 'block' : 'none' }}
        className='fixed z-20 w-full bottom-0 bg-white px-3 py-16 pt-12 shadow-2xl rounded-t-3xl'
      >
        <LookingForDriver fare={fare} vehicleType={vehicleType} pickup={pickup} destination={destination} setVehicleFound={setVehicleFound} setVehicleWaiting={setVehicleWaiting} ride={ride} />
      </div>

      <div 
        ref={vehicleWaitingRef}  
        style={{ display: vehicleWaiting ? 'block' : 'none' }}
        className='fixed z-20 w-full bottom-0 bg-white px-3 py-16 pt-12 shadow-2xl rounded-t-3xl'
      >
        <WaitingForDriver setVehicleWaiting={setVehicleWaiting} ride={ride} />
      </div>

    </div>
  )
}

export default Home
