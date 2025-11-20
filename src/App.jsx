import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AboutPage from './pages/About_us';
import OtpVerificationMethod from './pages/ForgotPassword';
import Blog from './pages/Blog/Blog';
import Reset_password from './pages/Reset_password';
import Client_data from './pages/Client_data';
import HostSpace from './pages/HostSpace';
import Contact_us from './pages/Contact_us';
import Dashboard from './pages/User/Dashboard';
import Admin from './pages/Admin/Admin';
import PropertiesTable from './components/PropertiesTable'; // Simple table component
import './App.css';
import CaretakerDashboard from './components/Caretaker_Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<AboutPage/>} />
        <Route path='/blog' element={<Blog/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/clientdata" element={<Client_data/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/otpmethod" element={<OtpVerificationMethod/>} />
        <Route path="/resetpassword" element={<Reset_password/>} />
        <Route path="/dashboard/*" element={<Dashboard/>} />
        <Route path="/caretaker-dashboard" element={<CaretakerDashboard/>} />
        <Route path="/contact" element={<Contact_us/>}/>
        <Route path="/hostspace" element={<HostSpace/>}/>
        {/* Single simple properties route */}
        <Route path="/properties" element={<PropertiesTable/>}/>
        <Route path="/admin/*" element={<Admin/>}/>
      </Routes>
    </Router>
  )
}

export default App;