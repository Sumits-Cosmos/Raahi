import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {
     
      const navigate = useNavigate();

      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [ vehicleColor, setVehicleColor ] = useState('')
      const [ vehiclePlate, setVehiclePlate ] = useState('')
      const [ vehicleCapacity, setVehicleCapacity ] = useState('')
      const [ vehicleType, setVehicleType ] = useState('')
     
      // const [captainData, setCaptainData] = useState({}); // baad me hatana hai


      const {captain, setCaptain} = React.useContext(CaptainDataContext)
    
      const submitHandler = async (e) => {
        e.preventDefault();
        const captainData = {
          fullName: {
            firstName: firstName,
            lastName: lastName
          },
          email: email,
          password: password,
          vehicle: {
            color: vehicleColor,
            numberPlate: vehiclePlate,
            capacity: vehicleCapacity,
            vehicleType: vehicleType
          }
        }
        console.log("SendingData: ",captainData);

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
        if(response.status === 201){
          const data = response.data;
          setCaptain(data);
          localStorage.setItem('token', data.token);
          navigate('/captain-home');
        }

        console.log(captainData);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setVehicleColor('')
        setVehiclePlate('')
        setVehicleCapacity('')
        setVehicleType('')
      }


  return (
     <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
            <Link to = '/'>
                <img className='w-16 mb-6' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="raahi" />
          </Link>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
        <h3 className='text-lg w-1/2 font-medium mb-2'>What's your name </h3>
        <div className='flex gap-3 mb-4'>
          <input
            className='bg-[#eeeeee]  rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
            required 
            type="text" 
            value={firstName}
            onChange={(e) => {
            setFirstName(e.target.value)
        }}
        placeholder='FirstName'
        />
          <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              required 
              type="text" 
              value={lastName}
              onChange={(e) => {
              setLastName(e.target.value)
          }}
          placeholder='LastName'
          />
        </div>
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input
        className='bg-[#eeeeee] mb-4 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
        required 
        type="email" 
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
        placeholder='email@example.com'
        />
        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
        <input 
        className='bg-[#eeeeee] mb-4 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
        required 
        type="password" 
        value = {password}
        onChange = {(e) => {
          setPassword(e.target.value)
        }}
        placeholder='Enter Password'
        />
         <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-4'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="bike">Bike</option>
            </select>
          </div>
        <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base' type='submit'>Create Account</button>
        <p className='text-center'>Already registered? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </form>
    </div>
    <div>
       <p className='text-[10px] leading-tight'>By proceeding, you consent to get calls, Whatsapp or SMS messages,
        including by automated means, from Raahi and its afflieates to the number provided</p>
    </div>
    </div>
  )
}

export default CaptainSignup
