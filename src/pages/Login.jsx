import React, { useEffect, useState } from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUser, userExists } from '@/lib/internal-firebase';
import { useAuth } from '@/lib/auth-context';

function Login() {
  // State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const {loadingUser, firebaseUser} = useAuth();

  // Handle input change with real-time error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Enhanced validation matching Signup component
  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation (matching signup requirements)
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };

  // Toggle password visibility with shake animation
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const googleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      
      const userCredential = await signInWithPopup(auth, provider);
      const existingUser = await userExists({email: userCredential.user.email||''});
      if(!existingUser) {
        const name = userCredential.user.displayName || `user-${Math.floor(Math.random()*1000 + 1)}-${Date.now()}`;

        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email||'',
          fullName: name,
          displayName: name,
          role: {role: "user"},
          createdAt: new Date(),
          lastLogin: new Date(),
        }
        await createUser(user);
        console.log("User created successfully", userCredential);
        
      }
      // additional handling here
      // @todo check if user did clientsurvey(if a client) before redirecting to destination
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      // Optionally show a toast or error message here
    } finally {
      setLoading(false);
    }
  }

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      // any additional function here
      navigate("/dashboard")
    } catch (error) {
      console.error("Error Signing ",error)
      Swal.fire({
        title: 'Error Signing in!',
        text: `error code: ${error.code || error.message}`,
        icon: 'error',
        confirmButtonColor: '#2563EB',
        confirmButtonText: 'Try again',
      })
      // additional handling here
      if(error.code && error.code=="auth/invalid-credential"){
        // @todo track the ip, number of trials, and maybe lock the account for verification
      }
    } finally {
      setLoading(false)
    }

    // Demo: Simulate API call delay
    /* setTimeout(() => {
      // Show success alert
      Swal.fire({
        title: 'Login Successful!',
        text: 'You have been logged in successfully.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
        confirmButtonText: 'Continue',
      }).then(() => {
        // Clear form data
        setFormData({ email: '', password: '' });
        // Navigate to dashboard (demo)
        navigate('/dashboard');
      });

      setLoading(false);
    }, 1500); */
  };

  useEffect(()=>{
    if(loadingUser) return;
    if(firebaseUser) return navigate('/dashboard');
  }, [loadingUser, firebaseUser, navigate])

  if (loadingUser) {
    return (
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='stack' />
      </div>
    )
  }

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
          Welcome back to Rentspot. Fill in the form to login
        </p>

        {errors.general && (
          <p className="text-red-500 text-sm text-center mb-3 font-Custom">{errors.general}</p>
        )}

        <form onSubmit={handleLogin} className='max-w-[28rem] mx-auto'>
          {/* Email */}
          <div className='mb-4'>
            <label htmlFor="email" className='font-Custom font-semibold text-gray-800 text-sm block mb-2'>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete='email'
              placeholder='your@email.com'
              disabled={loading}
              className={`w-full h-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 px-3 font-Custom font-medium text-sm border text-gray-600 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed transition-all`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-Custom">{errors.email}</p>}
          </div>

          {/* Password with Toggle */}
          <div className='mb-4 relative'>
            <label htmlFor="password" className='font-Custom font-semibold text-gray-800 text-sm block mb-2'>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              maxLength={50}
              value={formData.password}
              onChange={handleChange}
              autoComplete='current-password'
              placeholder='****************'
              disabled={loading}
              className={`w-full h-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 px-3 pr-12 font-Custom font-medium text-sm border text-gray-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed transition-all`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={loading}
              className={`absolute right-3 top-[2.15rem] text-gray-500 transition duration-300 ${
                shake ? 'animate-shake' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-Custom">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <Link to="/otpmethod">
            <p className='text-blue-600 font-Custom font-medium text-sm hover:text-blue-700 transition'>
              Forgot password?
            </p>
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className='font-Custom font-medium text-base h-11 rounded-lg mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          {/* Continue with Google */}
          <button
            onClick={googleSignIn}
            type="button"
            disabled={loading}
            className='justify-center border bg-white text-gray-800 font-Custom font-medium text-sm w-full h-11 rounded-lg shadow-md shadow-gray-300/40 mt-3 flex items-center text-center gap-2 mx-auto hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <img src={google} alt="Google logo" className='w-8 h-8' />
            Continue with Google
          </button>

          {/* Signup link */}
          <Link to="/signup">
            <p className='underline font-Custom font-medium text-sm text-blue-600 text-center mx-auto mt-5 hover:text-blue-700 transition'>
              Don't have an account? Sign up
            </p>
          </Link>
        </form>
      </div>
    </section>
  );
}

export default Login;