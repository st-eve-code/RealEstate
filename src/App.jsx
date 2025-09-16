import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OtpVerificationMethod from  './pages/ForgotPassword';
import Reset_password from './pages/Reset_password';
import Client_data from './pages/Client_data';
import Testimonial from './components/ScrollTestimonials';
import './App.css';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/clientdata" element={<Client_data/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/otpmethod" element={<OtpVerificationMethod/>} />
        <Route path="/resetpassword" element={<Reset_password/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App