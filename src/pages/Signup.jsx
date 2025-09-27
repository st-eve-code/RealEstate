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
  const [shake, setShake] = useState(false); // for shaking animation
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Show SweetAlert with confetti
      Swal.fire({
        title: '🎉 Congrats!',
        text: 'You have successfully created your account!',
        icon: 'success',
        confirmButtonText: 'Continue',
        backdrop: `
          rgba(0,10,0,0.4)
          url("https://cdn.jsdelivr.net/gh/aniftyco/party-js@1.0.4/assets/confetti.gif")
          left top
          no-repeat
        `,
      }).then(() => {
        // Navigate to Welcome component after confirmation
        navigate('/dashboard');
      });
    }
  };

  // Toggle password visibility and trigger shake animation
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setShake(true);
    setTimeout(() => setShake(false), 300); // Reset shake after animation
  };

  return (
    <section className='flex justify-center items-center min-h-screen mx-auto xl:h-[40rem] bg-gray-50'>
      <div className='max-w-[28rem] m-[2rem] border bg-white shadow-lg h-auto shadow-gray-300/40 mx-auto px-[2rem] py-4 rounded-xl'>
        <img src={logo} onClick={()=>navigate('/')} alt="RentSpot Logo" className="h-9 lg:h-10 w-auto pb-2 cursor-pointer mx-auto " />
        <p className='font-Nunito font-medium text-xs text-gray-500 text-center'>
          Welcome to Rentspot where every rental property has a calling. Fill in the form to get started.
        </p>

        <form onSubmit={handleSubmit} className='max-w-[28rem] mx-auto py-2'>
          {/* Username */}
          <div className='mb-3'>
            <label htmlFor="username" className='font-Custom font-semibold text-gray-800 text-md block'>
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              maxLength={24}
              placeholder='John Doe'
              autoComplete='on'
              value={formData.username}
              onChange={handleChange}
              className={`mt-2 w-full h-10 rounded-lg outline-blue-400 px-3 font-Custom font-medium text-md border text-gray-600 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username}</p>}
          </div>

          {/* Email */}
          <div className='mb-3'>
            <label htmlFor="email" className='font-Nunito font-semibold text-gray-800 text-md block'>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              maxLength={24}
              placeholder='your@email.com'
              autoComplete='on'
              value={formData.email}
              onChange={handleChange}
              className={`mt-2 w-full h-10 rounded-lg outline-blue-400 px-3 font-Custom font-medium text-md border text-gray-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-3 relative">
            <label htmlFor="password" className='font-Nunito font-semibold text-gray-800 text-md block'>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              maxLength={30}
              placeholder='****************'
              autoComplete='off'
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 w-full h-10 rounded-lg outline-blue-400 px-3 pr-12 font-Custom font-medium text-md border text-gray-600 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />

            {/* Eye icon with shake animation */}
            {/* using the password error to align the eye icon in the middle right corner */}
            {errors.password ?  
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute top-1/2  text-gray-500  right-4 transform -translate-y-2 transition duration-300 ${
                shake ? 'animate-shake' : ''
              }`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button> 
            : 
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute top-1/2 pt-2 text-gray-500  right-4 transform -translate-y-1 transition duration-300 ${
                shake ? 'animate-shake' : ''
              }`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>}
            

            {errors.password ? <span className="text-red-500 text-sm mt-1">{errors.password}</span> : ''}
          </div>

          {/* Register Button */}
          <button type="submit" className='font-Nunito font-medium text-lg h-12 rounded-md mt-2 w-full bg-blue-600 text-white hover:bg-blue-700 transition'>
            Register
          </button>

          {/* Google Button */}
          <button
            type="button"
            className='justify-center border bg-white text-gray-800 font-Custom font-medium text-md w-full h-12 rounded-md shadow-md shadow-gray-300/40 mt-2 flex items-center text-center gap-2 mx-auto hover:bg-gray-50 transition'
          >
            <img src={google} alt="Google logo" className='w-12 h-13' />
            Continue with Google
          </button>

          {/* Link to login */}
          <Link to="/login">
            <p className='font-Custom font-medium text-sm underline text-blue-600 text-center mx-auto pt-4'>
              Already have an account? Log in
            </p>
          </Link>

          {/* Terms */}
          <p className='font-Custom font-medium text-sm text-gray-600 text-center pt-3'>
            Signing up means you agree to our{' '}
            <a href="#" className='text-blue-600 underline'>Terms & Conditions</a> and{' '}
            <a href="#" className='text-blue-600 underline'>Privacy Policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;