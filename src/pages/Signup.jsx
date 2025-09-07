import React, { useState } from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      // TODO: API call or further logic
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className='flex justify-center items-center min-h-screen xl:h-[40rem] bg-gray-50'>
      <div className='max-w-[28rem] bg-white shadow-lg shadow-gray-300 mx-auto p-[2rem] rounded-xl'>
        <img src={logo} alt="Rentspot logo" className='w-[11rem] mx-auto' />
        <p className='font-Nunito font-medium text-sm text-gray-500 text-center'>
          Welcome to Rentspot where every rental property has a calling. Fill in the form to get started.
        </p>

        <form onSubmit={handleSubmit} className='max-w-[28rem] mx-auto py-5'>
          {/* Username */}
          <div className='mb-5'>
            <label htmlFor="username" className='font-Nunito font-semibold text-gray-800 text-md block'>
              Username
            </label>
            <input
              type="text"
              name="username"
              maxLength={24}
              id="username"
              placeholder='John Doe'
              autoComplete='on'
              value={formData.username}
              onChange={handleChange}
              className={`mt-2 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border text-gray-700 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username}</p>}
          </div>

          {/* Email */}
          <div className='mb-5'>
            <label htmlFor="email" className='font-Nunito font-semibold text-gray-800 text-md block'>
              Email
            </label>
            <input
              type="email"
              name="email"
              maxLength={24}
              id="email"
              placeholder='your@email.com'
              autoComplete='on'
              value={formData.email}
              onChange={handleChange}
              className={`mt-2 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border text-gray-700 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <label htmlFor="password" className='font-Nunito font-semibold text-gray-800 text-md block'>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              maxLength={25}
              placeholder='****************'
              autoComplete='off'
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 w-full h-11 rounded-lg outline-blue-400 p-3 pr-10 font-Nunito font-medium text-md border text-gray-700 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-4 transform translate-y-2 cursor-pointer text-gray-500 hover:text-gray-700"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
          </div>

          {/* Register Button */}
          <button type="submit" className='font-Nunito font-medium text-lg h-12 rounded-md mt-2 w-full bg-blue-600 text-white hover:bg-blue-700 transition'>
            Register
          </button>

          {/* Google Button */}
          <button
            type="button"
            className='justify-center border bg-white text-gray-800 font-Nunito font-medium text-md w-full h-12 rounded-md shadow-md shadow-gray-300/70 mt-4 flex items-center text-center gap-2 mx-auto hover:bg-gray-100 transition'
          >
            <img src={google} alt="Google logo" className='w-12 h-13' />
            Continue with Google
          </button>

          {/* Link to login */}
          <Link to="/login">
            <p className='font-Nunito font-medium text-sm underline text-blue-600 text-center mx-auto pt-6'>
              Already have an account? Log in
            </p>
          </Link>

          {/* Terms */}
          <p className='font-Nunito font-medium text-sm text-gray-500 text-center pt-4'>
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
