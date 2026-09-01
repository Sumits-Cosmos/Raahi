import React, { useState, useContext } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios'


const Login = () => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {user, setUser} = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const checkUser = {
        email: email,
        password: password
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, checkUser)
      
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      console.log("login successful");
      
      setEmail('');
      setPassword('');
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
    <div>
      <Link to = '/'>
             <img className='w-16 mb-10' src="./RaahiLogo.png" alt="raahi"/>
      </Link>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}
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
