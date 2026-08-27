import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CaptainsDetails from '../components/CaptainsDetails'
import RidePopup from '../components/RidePopup'
import LiveMap from '../components/LiveMap'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import axios from 'axios'
import ConfirmedRidePannel from '../components/ConfirmedRidePannel'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainHome = () => {
  const [RidePopupPannel, setRidePopupPannel] = useState(false);
  const RidePopupRef = useRef(null);
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false);
  const confirmedRidePanelRef = useRef(null);
  const [ride, setRide] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  useEffect(() => {
    if (socket && captain && captain._id) { 
        console.log("🔌 [CaptainHome JOIN] Socket ID:", socket.id, "Captain ID:", captain._id); 
        socket.emit("join", { userType: "captain", userId: captain._id });
    }

    const updateLocation = () => {
      if (navigator.geolocation && captain && captain._id) {
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

          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              latitude: lat,
              longitude: lng,
              heading
            },
            rideId: ride?._id,
            userSocketId: ride?.user?.socketId
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 5000)
    updateLocation()

    return () => {
      clearInterval(locationInterval);
    }
  }, [captain, socket, ride])

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = async (data) => {
      console.log('✅ [new-ride EVENT RECEIVED]', data);
      setRide(data);
      setRidePopupPannel(true);

      // Fetch pickup coordinates and route to display on map for captain
      if (data?.pickup) {
        try {
          const coordRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
            params: { address: data.pickup },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (coordRes.data) {
            setPickupCoords(coordRes.data);
          }
        } catch (err) {
          console.error('Error fetching pickup coordinates for new ride:', err);
        }
      }
    }

    socket.on('new-ride', handleNewRide);
    return () => socket.off('new-ride', handleNewRide);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleOtpVerified = (data) => {
      console.log('✅ [otp-verified EVENT RECEIVED]', data);
      setConfirmedRidePanel(false);
      setRidePopupPannel(false);
      
      // Navigate to captain riding screen
      navigate('/captain-riding', { state: { ride: data } });
    }

    socket.on('otp-verified', handleOtpVerified);
    return () => socket.off('otp-verified', handleOtpVerified);
  }, [socket, navigate]);

  async function confirmRide() {
    if (!ride) return;
    if (!captain || !captain._id) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
        rideId: ride._id,
        captainId: captain._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRide(response.data);
      setRidePopupPannel(false);
      setConfirmedRidePanel(true);
    } catch (err) {
      console.error('❌ Error confirming ride:', err.response?.data || err.message);
      alert(`Failed to confirm ride: ${err.response?.data?.message || err.message}`);
    }
  }

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
    <div className='h-screen relative overflow-hidden'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-full z-[500] pointer-events-none'>
        <Link to = '/' className='pointer-events-auto'>
          <img className='w-16 absolute left-5 top-5' src="RaahiLogo.png" alt="raahi"/>
        </Link>
        <Link to= '/captain-logout' className='pointer-events-auto fixed h-10 w-10 block right-4 top-4 bg-white flex items-center justify-center rounded-full shadow-md'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-3/5 w-full'>
        <LiveMap
          captainLocation={captainLocation}
          pickupCoords={pickupCoords}
          routeCoordinates={routeCoordinates}
          vehicleType={captain?.vehicle?.vehicleType || 'car'}
        />
      </div>

      <div className='h-2/5 p-6 bg-white rounded-t-3xl shadow-2xl relative z-10'>
        <CaptainsDetails/>
      </div>

      <div ref={RidePopupRef} className='fixed z-20 w-full bottom-0 bg-white px-3 py-16 translate-y-full pt-12 shadow-2xl rounded-t-3xl'>
        <RidePopup ride={ride} setRidePopupPannel={setRidePopupPannel} onAccept={confirmRide} />
      </div>

      <div ref={confirmedRidePanelRef} className='fixed z-20 h-screen w-full bottom-0 bg-white px-3 py-10 translate-y-full pt-12 shadow-2xl'>
        <ConfirmedRidePannel ride={ride} setConfirmedRidePanel={setConfirmedRidePanel} setRidePopupPannel={setRidePopupPannel}/>
      </div>
    </div>
  )
}

export default CaptainHome
