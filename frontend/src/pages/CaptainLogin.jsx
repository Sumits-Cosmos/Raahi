import React, { useState } from 'react'
import { data, Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainLogin = () => {
   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [captainData, setCaptianData] = useState({ }); //isko hateyenge

    const {captain, setCaptain} = useContext(CaptainDataContext)
    const navigate = useNavigate();
  
    const submitHandler = async (e) => {
      e.preventDefault();
      const checkCaptain ={
        email: email,
        password: password 
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, checkCaptain);
      if(response.status === 200){
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }
      // console.log(data);
      setEmail('');
      setPassword('');
    }

  return (
   <div className='p-7 flex flex-col justify-between h-screen'>
    <div>
      <Link to = '/'>
        <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="raahi"/>
      </Link>
      <form onSubmit={(e) => {
        submitHandler(e)
      }}>
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input
        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
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
        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
        required 
        type="password" 
        value = {password}
        onChange = {(e) => {
          setPassword(e.target.value)
        }}
        placeholder='Enter Password'
        />
        <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base' type='submit'>Login</button>
        <p className='text-center'>Want to join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
      </form>
    </div>
    <div>
       <Link to='/login' className='bg-[#d5622d] flex item-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base' type='submit'>SignIn as User</Link>
    </div>
    </div>
  )
}

export default CaptainLogin
