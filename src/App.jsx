import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Forgot_password from './pages/Forgot_password';
import OtpVerificationMethod from  './pages/Otpcode_method';
import './App.css';
import Otp_confirm from './pages/Otp_confirm';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgot_password />} />
        <Route path="/otpmethod" element={<OtpVerificationMethod />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/otpconfirm" element={<Otp_confirm />} />
      </Routes>
    </Router>
  )
}

export default App