import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
// Mock logo component since we don't have the actual SVG
const Logo = () => (
  <div className="w-36 h-16 mx-auto flex items-center justify-center mb-2">
    <img src={logo} alt="" />
  </div>
);

function ResetPassword() {

   const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Handle redirect countdown and automatic redirect
  useEffect(() => {
    let timer;
    if (isSuccess && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSuccess && redirectCountdown === 0) {
      // Redirect to login page
      handleRedirectToLogin();
    }
    return () => clearTimeout(timer);
  }, [isSuccess, redirectCountdown]);

  // Function to handle redirect to login
  const handleRedirectToLogin = () => {
    // Clear any existing auth tokens for security
    // Note: localStorage won't work in Claude.ai artifacts
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('refreshToken');
    // In a real app, this would navigate to /login?passwordReset=success
    navigate('/login');
    console.log('Redirecting to login page...');
  };

  // Password strength validation
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/(?=.*[a-z])/.test(password)) errors.push('One lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('One uppercase letter');
    if (!/(?=.*\d)/.test(password)) errors.push('One number');
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push('One special character');
    return errors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain: ${passwordErrors.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to reset the password
      // await resetPasswordAPI({ password: formData.password, token: resetToken });
      
      console.log('Password reset successful:', formData.password);
      
      // Clear any existing sessions for security
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      setIsSuccess(true);
    } catch (error) {
      setErrors({
        submit: 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state with automatic redirect
  if (isSuccess) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password Updated!</h2>
          <p className="text-gray-600 mb-4">
            Your password has been successfully changed. Please log in with your new password to continue.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will be redirected to the login page in {redirectCountdown} seconds...
          </p>
          <div className="space-y-3">
            <button 
              onClick={handleRedirectToLogin}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue to Login ({redirectCountdown}s)
            </button>
            <button 
              onClick={() => {
                setRedirectCountdown(0);
                setIsSuccess(false);
                // Reset form
                setFormData({ password: '', confirmPassword: '' });
                setErrors({});
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Reset Another Password
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg shadow-gray-200/40 rounded-xl p-8">
        <Logo />
        
        <div className="text-center mb-6">
          <p className="text-gray-600 font-Custom font-bold text-sm">Enter a new password to continue.</p>
        </div>

        <div className="space-y-6">
          {/* New Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold font-Custom text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={50}
                placeholder="Enter your new password"
                className={`w-full font-Custom h-10 text-md px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 font-Custom text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-Custom font-semibold text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={50}
                placeholder="Confirm your new password"
                className={`w-full h-10 font-Custom px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm font-Custom text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-Custom text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            } text-white font-Custom`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Password...
              </span>
            ) : (
              'Update Password'
            )}
          </button>

          {/* Cancel Link */}
          <div className="text-center">
            <button 
              type="button"
              onClick={() => {
                // In a real app, you would navigate back to login
                console.log('Navigating back to login page');
                navigate('/login');
              }}
              className="text-sm text-blue-600 font-Custom hover:text-blue-800 underline font-medium bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• One uppercase letter (A-Z)</li>
            <li>• One lowercase letter (a-z)</li>
            <li>• One number (0-9)</li>
            <li>• One special character (@$!%*?&)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;