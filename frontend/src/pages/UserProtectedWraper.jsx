import {React,useContext} from 'react'
import { UserDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


const UserProtectedWraper = ({children}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    useEffect(() => {
        if(!token){
          navigate('/login');
        }
    }, [token])

    
  return (
    <>
      {children}
    </>
  )
}

export default UserProtectedWraper
