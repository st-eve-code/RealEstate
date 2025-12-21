import React from 'react';
import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';
import PropertiesTable from './components/PropertiesTable'; // Simple table component
import './App.css';
import { MessagingProvider } from './components/Messaging';
import { useAuthStateChange } from './Hooks/useAuthStateChange';

/**
 * App-level component to handle auth state changes
 * This can be used for analytics, logging, or other app-wide auth-related logic
 */
function AppAuthHandler() {
  useAuthStateChange({
    onAuthStateChanged: (user) => {
      // Log auth state changes for debugging
      if (user) {
        console.log('[App] User authenticated:', user.email);
        redirect('/dashboard');
      } else {
        console.log('[App] User signed out');
        redirect('/login')
      }
    },
    onSignIn: (user) => {
      // Handle sign in events at app level
      // You can add analytics, logging, etc. here
      console.log('[App] User signed in:', user.email);
      
    },
    onSignOut: () => {
      // Handle sign out events at app level
      // You can clear app-wide state, analytics, etc. here
      console.log('[App] User signed out');
    },
  });

  return null; // This component doesn't render anything
}

function App() {
  return (
    <Router>
      <AppAuthHandler />
      <MessagingProvider>
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
        <Route path="/contact" element={<Contact_us/>}/>
        <Route path="/hostspace" element={<HostSpace/>}/>
        {/* Single simple properties route */}
        <Route path="/properties" element={<PropertiesTable/>}/>
      </Routes>
      </MessagingProvider>
    </Router>
  )
}

export default App;