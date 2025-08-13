import { useState } from 'react';
import useEcommerce from '../../context/EcommerceContext';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, CheckCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUp = () => {
  const { signup } = useEcommerce();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      await toast.promise(
        (async () => {
          await signup(email, password, () => {
            setShowConfirmation(true);
          });
        })(),
        {
          loading: 'Creating your account...',
          success: 'Account created successfully!',
          error: (err) => err.message || 'Failed to create account'
        }
      );
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500 rounded-full filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full filter blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            {/* Success Animation */}
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">Account Created!</h2>
            
            <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
              <Send className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-gray-200 text-lg leading-relaxed">
                Please check your email{' '}
                <span className="text-red-400 font-semibold">(including spam folder)</span>{' '}
                to confirm and activate your account.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center group"
              >
                Go to Login
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <p className="text-sm text-gray-300">
                Didn't receive the email?{' '}
                <button className="text-emerald-400 hover:text-white font-medium transition-colors duration-200">
                  Resend confirmation
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Join us to start your journey</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-11 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-11 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-300 mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-indigo-300 hover:text-white font-semibold transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            By creating an account, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;