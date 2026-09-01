import {React, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'


const CaptainProtectWrapper = ({children}) => {
 
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const {captain, setCaptain} = useContext(CaptainDataContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {   
    if(!token){
        navigate('/captain-login');
        return;
    }
     axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status === 200 && response.data && response.data._id){
            console.log("Full API Response:", response.data);
            setCaptain(response.data)
            setIsLoading(false);
        } else {
            localStorage.removeItem('token');
            setIsLoading(false);
            navigate('/captain-login');
        }          
    }).catch((err) => {
        console.log(err);
        localStorage.removeItem('token');
        setIsLoading(false);
        navigate('/captain-login');
    })

     }, [token])
   
    
    if(isLoading){
        return <div>Loading...</div>
    }


  return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectWrapper
