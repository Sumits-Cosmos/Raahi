import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState, useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide';
import LiveMap from '../components/LiveMap';
import { CaptainDataContext } from '../context/CaptainContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

const CaptainRiding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [FinishRidePannel, setFinishRidePannel] = useState(false);
  const FinishRidePannelRef = useRef(null);
  const [ride, setRide] = useState(location.state?.ride || null);
  const [checkMount, setCheckMount] = useState(false);
  
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (location.state?.ride) {
      setRide(location.state.ride);
    }
  }, [location.state]);

  // Fetch route coordinates if ride is active
  useEffect(() => {
    if (ride && ride.pickup && ride.destination && routeCoordinates.length === 0) {
      axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-route`, {
        params: { origin: ride.pickup, destination: ride.destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        if (res.data) {
          setRouteCoordinates(res.data.coordinates || []);
          setPickupCoords(res.data.pickupCoords || null);
          setDestinationCoords(res.data.destinationCoords || null);
        }
      })
      .catch(err => console.error('Error fetching route in CaptainRiding:', err));
    }
  }, [ride, routeCoordinates.length]);

  // Real-time GPS stream for captain on ongoing ride
  useEffect(() => {
    if (!captain || !captain._id) return;

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const heading = position.coords.heading || 0;

          setCaptainLocation({
            latitude: lat,
            longitude: lng,
            heading,
            vehicleType: captain.vehicle?.vehicleType || 'car'
          });

          if (socket) {
            socket.emit('update-location-captain', {
              userId: captain._id,
              location: {
                latitude: lat,
                longitude: lng,
                heading
              },
              rideId: ride?._id,
              userSocketId: ride?.user?.socketId || ride?.user
            });
          }
        });
      }
    };

    const interval = setInterval(updateLocation, 4000);
    updateLocation();

    return () => clearInterval(interval);
  }, [captain, socket, ride]);

  // Only redirect if still no ride after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckMount(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (checkMount && !ride) {
      console.log('⚠️ [CaptainRiding] No ride data after timeout, redirecting to captain-home');
      navigate('/captain-home');
    }
  }, [checkMount, ride, navigate]);

  useGSAP(() => {
    gsap.to(FinishRidePannelRef.current, {
      transform: FinishRidePannel ? 'translateY(0%)' : 'translateY(100%)'
    })
  }, [FinishRidePannel]);

  return (
    <div className='h-screen relative overflow-hidden flex flex-col justify-between'>
      {/* Top Header */}
      <div className='fixed p-4 top-0 flex items-center justify-between w-full z-[500] pointer-events-none'>
        <Link to='/' className='pointer-events-auto'>
          <img className='w-16' src="RaahiLogo.png" alt="raahi"/>
        </Link>
        <Link to='/captain-logout' className='pointer-events-auto h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Live Map Navigation */}
      <div className='h-4/5 w-full'>
        <LiveMap
          captainLocation={captainLocation}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          routeCoordinates={routeCoordinates}
          vehicleType={captain?.vehicle?.vehicleType || 'car'}
        />
      </div>

      {/* Ride Bottom Bar */}
      <div
        onClick={() => setFinishRidePannel(true)} 
        className='h-1/5 p-6 flex bg-yellow-400 items-center justify-between relative cursor-pointer shadow-2xl rounded-t-3xl z-10'
      >
        <h5 className='p-2 w-[93%] text-center absolute top-0'>
          <i className="text-2xl text-gray-700 ri-arrow-up-wide-fill"></i>
        </h5>
        <div>
          <h4 className='text-xl font-bold text-gray-900'>
            {ride?.destination ? ride.destination.split(',')[0] : 'Navigating to destination'}
          </h4>
          <p className='text-sm font-semibold text-gray-800'>
            Rider: {ride?.user?.fullName?.firstName ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName || ''}` : 'Passenger'}
          </p>
        </div>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePannel(true);
          }}
          className='bg-green-600 hover:bg-green-700 text-white font-bold p-3 px-8 rounded-xl shadow-lg transition-all active:scale-95'
        >
          Complete Ride
        </button>
      </div>   

      <div ref={FinishRidePannelRef} className='fixed z-20 h-screen w-full bottom-0 bg-white px-4 py-16 translate-y-full pt-12 shadow-2xl'>
        <FinishRide ride={ride} setFinishRidePannel={setFinishRidePannel} />
      </div>   
    </div>
  )
}

export default CaptainRiding
