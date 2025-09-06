import React, { useState } from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

function Login() {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // for future redirection

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Simulated login API
  const fakeLoginApi = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 2000);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length > 0 && password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fakeLoginApi();
      if (res.success) {
        // ✅ Show success alert
        Swal.fire({
          title: 'Login Successful!',
          text: 'You have been logged in successfully.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
          confirmButtonText: 'Continue',
        }).then(() => {
          // 🔜 Placeholder for dashboard redirect
          // TODO: Replace '/dashboard' with actual route when it's ready
          navigate('/dashboard');
        });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });

      // 🔴 Optional: SweetAlert2 error
      Swal.fire({
        title: 'Login Failed',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='flex justify-center items-center min-h-screen xl:h-[68rem] bg-gray-50'>
      <div className='max-w-[28rem] shadow-lg shadow-gray-300  mx-auto  p-8 rounded-xl'>
        <img src={logo} alt="Rentspot logo" className='w-[11rem] py-2 mx-auto' />
        <p className='font-Nunito font-medium text-md pt-2 text-gray-500 text-center'>
          Welcome back to Rentspot. Fill in the form to login
        </p>

        {errors.general && (
          <p className="text-red-500 text-sm text-center mt-3">{errors.general}</p>
        )}

        <form onSubmit={handleLogin} className='max-w-[25rem] py-6'>
          {/* Email */}
          <label htmlFor="email" className='font-Nunito font-semibold text-gray-800 text-md'>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={50}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
            placeholder='your@gmail.com'
            className={`mb-1 mt-3 w-full h-11 rounded-lg p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-700 outline-blue-400 font-Nunito font-medium text-md`}
          />
          {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

          {/* Password with Toggle */}
          <label htmlFor="password" className='font-Nunito font-semibold text-gray-800 text-md'>
            Password
          </label>
          <div className='relative mt-3'>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              maxLength={30}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              placeholder='••••••••••••••••'
              className={`w-full h-11 rounded-lg p-3 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-700 outline-blue-400 font-Nunito font-medium text-md`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mb-3 mt-1">{errors.password}</p>}

          <Link to="/otpmethod">
            <p className='text-blue-600 font-Nunito font-medium text-sm pt-4'>
              Forgot password?
            </p>
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`font-Nunito font-medium text-lg h-12 rounded-md mt-5 w-full ${loading ? 'bg-blue-400' : 'bg-blue-600'} text-white transition duration-300`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Continue with Google */}
          <button
            type="button"
            className='justify-center bg-white border text-gray-800 font-Nunito font-medium text-md w-full h-12 rounded-md shadow-md shadow-gray-300 mt-4 flex items-center gap-2 mx-auto'
          >
            <img src={google} alt="Google logo" className='w-12 h-13' />
            Continue with Google
          </button>

          {/* Signup link */}
          <Link to="/signup">
            <p className='underline font-Nunito font-medium text-sm text-blue-600 text-center mx-auto pt-8'>
              Don't have an account? Sign up
            </p>
          </Link>
        </form>
      </div>
    </section>
  );
}

export default Login;