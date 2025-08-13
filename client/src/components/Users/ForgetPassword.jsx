import { useState } from 'react';
import { Mail, ArrowRight, KeyRound, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [coolDown, setCoolDown] = useState(0);
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (coolDown > 0 || !validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://simdis-glossy-affair.vercel.app/reset-password',
      });

      if (error) {
        toast.error(error.message || 'Error sending reset link');
        setErrors({ email: error.message });
      } else {
        toast.success('Reset link sent! Check your email');
        setEmailSent(true);
        setCoolDown(60); // 60 seconds cooldown

        const timer = setInterval(() => {
          setCoolDown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    setCoolDown(0);
  };

  if (emailSent && coolDown === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500 rounded-full filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full filter blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-2xl mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">Email Sent!</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We've sent a password reset link to{' '}
              <span className="text-green-400 font-semibold">{email}</span>
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
                <p className="text-sm text-gray-300 mb-2">Next steps:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Look in spam/junk folder if needed</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create your new password</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResend}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Send Another Email
              </button>

              <a
                href="/login"
                className="inline-flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 group"
              >
                Back to Login
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-300">Enter your email to receive a reset link</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div onSubmit={handleSend} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || coolDown > 0}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : coolDown > 0 ? (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  Wait {coolDown}s
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-center">
            <div>
              <a 
                href="/login" 
                className="text-blue-300 hover:text-white font-medium transition-colors duration-200"
              >
                Back to Login
              </a>
            </div>
            <div>
              <p className="text-gray-300 text-sm">
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="text-blue-300 hover:text-white font-semibold transition-colors duration-200"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            We'll send you a secure link to reset your password
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;