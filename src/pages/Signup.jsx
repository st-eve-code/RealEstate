import React, { useState } from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Enhanced validation with stronger password requirements
  const validate = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Enhanced password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must include a lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must include an uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include a number';
    }
    
    return newErrors;
  };

  // Get password strength
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&#])/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);

      // TODO: Implement API integration here
      // Example:
      // try {
      //   const response = await fetch('/api/signup', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData)
      //   });
      //   
      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || 'Registration failed');
      //   }
      //   
      //   const data = await response.json();
      //   // Handle successful registration
      // } catch (error) {
      //   // Handle errors
      //   Swal.fire({
      //     title: 'Error!',
      //     text: error.message || 'Something went wrong. Please try again.',
      //     icon: 'error',
      //     confirmButtonText: 'OK',
      //     confirmButtonColor: '#ef4444',
      //   });
      // }

      // Demo: Simulate API call delay
      setTimeout(() => {
        // Show success alert with confetti
        Swal.fire({
          title: '🎉 Congrats!',
          text: 'You have successfully created your account!',
          icon: 'success',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#2563eb',
          backdrop: `
            rgba(0,0,1,0.4)
            url("https://cdn.jsdelivr.net/gh/aniftyco/party-js@1.0.4/assets/confetti.gif")
            left top
            no-repeat
          `,
        }).then(() => {
          // Clear form data
          setFormData({ username: '', email: '', password: '' });
          // Navigate to clientdata (demo)
          navigate('/clientdata');
        });

        setIsLoading(false);
      }, 1500);
    }
  };

  // Toggle password visibility with shake animation
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const passwordStrength = getPasswordStrength();

  return (
    <section className='flex justify-center items-center min-h-screen mx-auto xl:h-[40rem] bg-gray-50'>
      <div className='max-w-[28rem] m-8 border bg-white shadow-lg h-auto shadow-gray-300/40 mx-auto px-8 py-6 rounded-xl'>
        <img 
          src={logo} 
          onClick={() => navigate('/')} 
          alt="RentSpot Logo" 
          className="h-9 lg:h-10 w-auto mb-3 cursor-pointer mx-auto" 
        />
        <p className='font-Custom font-medium text-xs text-gray-500 text-center mb-4'>
          Welcome to Rentspot where every rental property has a calling. Fill in the form to get started.
        </p>

        <form onSubmit={handleSubmit} className='max-w-[28rem] mx-auto'>
          {/* Username */}
          <div className='mb-4'>
            <label htmlFor="username" className='font-Custom font-semibold text-gray-800 text-sm block mb-2'>
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              maxLength={50}
              placeholder='John Doe'
              autoComplete='username'
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full h-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 px-3 font-Custom font-medium text-sm border text-gray-600 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed transition-all`}
            />
            {errors.username && <p className='text-red-500 text-xs mt-1 font-Custom'>{errors.username}</p>}
          </div>

          {/* Email */}
          <div className='mb-4'>
            <label htmlFor="email" className='font-Custom font-semibold text-gray-800 text-sm block mb-2'>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder='your@email.com'
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full h-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 px-3 font-Custom font-medium text-sm border text-gray-600 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed transition-all`}
            />
            {errors.email && <p className='text-red-500 text-xs mt-1 font-Custom'>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className='font-Custom font-semibold text-gray-800 text-sm block mb-2'>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              maxLength={50}
              placeholder='****************'
              autoComplete='new-password'
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full h-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-12 font-Custom font-medium text-sm border text-gray-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed transition-all`}
            />

            {/* Simplified eye icon positioning */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
              className={`absolute right-3 top-[2.15rem] text-gray-500 transition duration-300 ${
                shake ? 'animate-shake' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>

            {errors.password && (
              <p className='text-red-500 text-xs mt-1 font-Custom'>{errors.password}</p>
            )}

            {/* Password strength indicator */}
            {formData.password && !errors.password && (
              <div className='mt-2'>
                <div className='flex justify-between items-center mb-1'>
                  <span className='text-xs font-Custom text-gray-600'>Password Strength:</span>
                  <span className={`text-xs font-Custom font-semibold ${
                    passwordStrength.label === 'Weak' ? 'text-red-500' :
                    passwordStrength.label === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-1.5'>
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className='font-Custom font-medium text-base h-11 rounded-lg mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Register'
            )}
          </button>

          {/* Google Button */}
          <button
            type="button"
            disabled={isLoading}
            className='justify-center border bg-white text-gray-800 font-Custom font-medium text-sm w-full h-11 rounded-lg shadow-md shadow-gray-300/40 mt-3 flex items-center text-center gap-2 mx-auto hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <img src={google} alt="Google logo" className='w-5 h-5' />
            Continue with Google
          </button>

          {/* Link to login */}
          <Link to="/login">
            <p className='font-Custom font-medium text-sm underline text-blue-600 text-center mx-auto mt-5 hover:text-blue-700 transition'>
              Already have an account? Log in
            </p>
          </Link>

          {/* Terms */}
          <p className='font-Custom font-medium text-xs text-gray-600 text-center mt-4'>
            Signing up means you agree to our{' '}
            <a href="#" className='text-blue-600 underline hover:text-blue-700'>Terms & Conditions</a> and{' '}
            <a href="#" className='text-blue-600 underline hover:text-blue-700'>Privacy Policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;