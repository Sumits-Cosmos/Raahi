import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/userContext'


const UserSignup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();
    const {user, setUser} = useContext(UserDataContext)


    const submitHandler = async (e) => {
      e.preventDefault();
     const newUser = {
      fullName: {
          firstName: firstName,
          lastName: lastName
        },
        email: email,
        password: password 
     }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
    if(response.status === 201){
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      console.log("registration successful");
      navigate('/captain-home');
    }
      setFirstName('');
      setLastName('');
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
        <h3 className='text-lg w-1/2 font-medium mb-2'>What's your name</h3>
        <div className='flex gap-3 mb-6'>
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
        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
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
        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
        required 
        type="password" 
        value = {password}
        onChange = {(e) => {
          setPassword(e.target.value)
        }}
        placeholder='Enter Password'
        />
        <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base' type='submit'>Create Account</button>
        <p className='text-center'>Exisiting user? <Link to='/login' className='text-blue-600'>Login here</Link></p>
      </form>
    </div>
    <div>
       <p className='text-[10px] leading-tight'>By proceeding, you consent to get calls, Whatsapp or SMS messages,
        including by automated means, from Raahi and its afflieates to the number provided</p>
    </div>
    </div>
  )
}

export default UserSignup
