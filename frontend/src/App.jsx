import React from 'react'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserProtectedWraper from './pages/UserProtectedWraper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin/>} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/home' element={<UserProtectedWraper><Home/></UserProtectedWraper>} />
        <Route path='/user/logout' element={<UserProtectedWraper><UserLogout/></UserProtectedWraper>} />        
        <Route path='/captain-home' element={<CaptainProtectWrapper><CaptainHome/></CaptainProtectWrapper>} />
        <Route path='/captain-logout' element={<CaptainProtectWrapper><CaptainLogout/></CaptainProtectWrapper>} />
      </Routes>
    </div>
  )
}

export default App
