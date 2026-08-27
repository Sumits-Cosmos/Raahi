import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LiveMap from '../components/LiveMap'
import RideSummaryModal from '../components/RideSummaryModal'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const [ride, setRide] = useState(location.state?.ride || null);
  const initialRoute = location.state?.routeCoordinates || [];
  const initialPickup = location.state?.pickupCoords || null;
  const initialDestination = location.state?.destinationCoords || null;

  const [routeCoordinates, setRouteCoordinates] = useState(initialRoute);
  const [pickupCoords, setPickupCoords] = useState(initialPickup);
  const [destinationCoords, setDestinationCoords] = useState(initialDestination);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // If route coordinates are not in location.state, fetch them
  useEffect(() => {
    if (ride && routeCoordinates.length === 0 && ride.pickup && ride.destination) {
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
      .catch(err => console.error('Error fetching route in Riding:', err));
    }
  }, [ride, routeCoordinates.length]);

  // Initial captain location
  useEffect(() => {
    if (ride?.captain?.location?.coordinates) {
      setCaptainLocation({
        latitude: ride.captain.location.coordinates[1],
        longitude: ride.captain.location.coordinates[0],
        heading: 0,
        vehicleType: ride.captain?.vehicle?.vehicleType || 'car'
      });
    }
  }, [ride]);

  // Listen for real-time driver movement and ride completion
  useEffect(() => {
    if (!socket) return;

    if (ride?._id) {
      socket.emit('join-ride-room', { rideId: ride._id });
    }

    const handleDriverLocation = (data) => {
      if (data && data.location) {
        setCaptainLocation({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          heading: data.location.heading || 0,
          vehicleType: ride?.captain?.vehicle?.vehicleType || 'car'
        });
      }
    };

    const handleRideCompleted = (data) => {
      console.log('🏁 [ride-completed EVENT RECEIVED]', data);
      const finishedRide = data?.ride || data || ride;
      setRide(finishedRide);
      setShowSummaryModal(true);
    };

    const handleRideCancelled = (data) => {
      console.log('🚫 [ride-cancelled EVENT RECEIVED]', data);
      alert(`This ride was cancelled by ${data?.cancelledBy || 'captain'}. Reason: ${data?.reason || 'Not specified'}`);
      navigate('/home');
    };

    socket.on('driver-location-update', handleDriverLocation);
    socket.on('ride-completed', handleRideCompleted);
    socket.on('ride-cancelled', handleRideCancelled);

    return () => {
      socket.off('driver-location-update', handleDriverLocation);
      socket.off('ride-completed', handleRideCompleted);
      socket.off('ride-cancelled', handleRideCancelled);
    };
  }, [socket, ride, navigate]);

  const captainName = ride?.captain?.fullName?.firstName
    ? `${ride.captain.fullName.firstName} ${ride.captain.fullName.lastName || ''}`
    : 'Captain Assigned';

  const vehicleInfo = ride?.captain?.vehicle
    ? `${ride.captain.vehicle.vehicleType?.toUpperCase()} • ${ride.captain.vehicle.numberPlate}`
    : 'Vehicle';

  const destinationAddress = ride?.destination || location.state?.destination || 'Destination';
  const fareAmount = ride?.fare || '199';

  return (
    <div className='h-screen relative overflow-hidden flex flex-col justify-between'>
      {/* Top Bar */}
      <div className='fixed p-4 top-0 flex items-center justify-between w-full z-[500] pointer-events-none'>
        <Link to='/home' className='pointer-events-auto'>
          <img className='w-16' src="RaahiLogo.png" alt="raahi" />
        </Link>
        <Link to='/home' className='pointer-events-auto h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
          <i className="font-medium text-lg ri-home-2-line"></i>
        </Link>
      </div>

      {/* Interactive Live Map */}
      <div className='h-1/2 w-full'>
        <LiveMap
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          routeCoordinates={routeCoordinates}
          captainLocation={captainLocation}
          vehicleType={ride?.captain?.vehicle?.vehicleType || 'car'}
        />
      </div>

      {/* Driver & Ride Details Sheet */}
      <div className='h-1/2 p-6 bg-white rounded-t-3xl shadow-2xl flex flex-col justify-between z-10'>
        <div>
          <div className='flex items-center justify-between mb-4 gap-3'>
            <div className='flex items-center gap-3'>
              <div className='w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold shadow-md'>
                {ride?.captain?.fullName?.firstName?.charAt(0) || 'C'}
              </div>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>{captainName}</h2>
                <p className='text-xs font-semibold text-gray-500 tracking-wider'>{vehicleInfo}</p>
                {ride?.captain?.vehicle?.color && (
                  <p className='text-xs text-gray-400 capitalize'>{ride.captain.vehicle.color} vehicle</p>
                )}
              </div>
            </div>
            <div className='bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full border border-green-300'>
              ON TRIP
            </div>
          </div>

          <div className='w-full mt-2 divide-y divide-gray-100'>
            <div className='flex items-start gap-4 py-3'>
              <i className="text-xl text-red-600 ri-map-pin-2-fill mt-0.5"></i>
              <div>
                <h3 className='text-base font-semibold text-gray-800 leading-tight'>Destination</h3>
                <p className='text-sm text-gray-600 line-clamp-1'>{destinationAddress}</p>
              </div>
            </div>

            <div className='flex items-center justify-between py-3'>
              <div className='flex items-center gap-4'>
                <i className="text-xl text-green-600 ri-money-rupee-circle-fill"></i>
                <div>
                  <h3 className='text-lg font-bold text-gray-900'>₹{fareAmount}</h3>
                  <p className='text-xs text-gray-500'>Payment Method: Cash / UPI / Wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type='button'
          onClick={() => setShowSummaryModal(true)}
          className='w-full bg-black hover:bg-gray-900 active:scale-95 text-white font-bold p-3.5 rounded-2xl text-lg shadow-xl transition-all'
        >
          Pay & View Summary
        </button>
      </div>

      {/* Completion & Payment Modal */}
      {showSummaryModal && (
        <RideSummaryModal
          ride={ride}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </div>
  )
}

export default Riding
