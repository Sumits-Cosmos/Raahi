import React, { useState, useContext } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { UserDataContext } from '../context/userContext';
import axios from 'axios'


const Login = () => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();
  const {user, setUser} = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    // setUserData({
    //   email: email,            // from state management for only frontend purpose
    //   password: password 
    // })
    const checkUser = {
      email: email,
      password: password
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, checkUser)
    if(response.status === 200){
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      console.log("login successful");
      navigate('/home');
    }else{
      console.log("login failed");
    }
    
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
        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </form>
    </div>
    <div>
       <Link to='/captain-login' className='bg-emerald-500 flex item-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base' type='submit'>SignIn as Captain</Link>
    </div>
    </div>
  )
}

export default Login
