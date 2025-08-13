import { useEffect, useState } from "react"
import { CheckCircle, Mail, ArrowRight, Shield } from "lucide-react"

import { supabase } from "../../lib/supabase";

const EmailConfirmed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Use proper routing in your app instead of window.location
          window.location.href = '/login';
          return;
        }

        if (!data.session) {
          window.location.href = '/login';
          return;
        }

        setUser(data.session.user);
      } catch (err) {
        console.error('Unexpected error:', err);
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleContinue = () => {
    // Navigate to profile or main app
    window.location.href = '/shop';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#a75e5eb3] to-[#ac9f9f] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a75e5eb3] to-[#ac9f9f] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full opacity-30"></div>
        
        {/* Main content */}
        <div className="relative z-10">
          {/* Success icon with animation */}
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your email address has been successfully verified.
          </p>

          {/* User info card */}
          {user && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-center text-xs text-green-600">
                <Shield className="w-4 h-4 mr-1" />
                Verified
              </div>
            </div>
          )}

          {/* Benefits list */}
          <div className="text-left mb-8 space-y-3">
            <h3 className="font-semibold text-gray-900 text-center mb-4">
              What's next?
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Access to your secure profile
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Receive important notifications
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Full access to all features
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center group"
            >
              Continue to Shop
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button
              onClick={() => window.location.href = '/profile'}
              className="w-full cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Update Profile
            </button>
          </div>

          {/* Footer message */}
          <p className="text-xs text-gray-500 mt-6 leading-relaxed">
            Welcome aboard! If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmed;