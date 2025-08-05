import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = ('');

  useEffect(() => {
    // Supabase to auto login user from the token to reset password
    supabase.auth.getUser().then(({ data }) => {
      if (data.error) setShowForm(true);
    });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage('Error updating password');
      toast.error('Error updating password');
    } else {
      setMessage('Password updated! You can now log in.');
      toast.success('Password updated! You can now log in.');
    }
  };

  if (!showForm) return (
    <div className='min-h-[50vh] w-full h-full flex items-center justify-center bg-[#8f8b8b]'>
      <div className='w-32 h-32 border-8 border-indigo-600 border-t-transparent border-b-transparent rounded-full animate-spin'>
        {/* <p className='text-xl w-full h-full flex items-center justify-center fixed'>Loading...</p> */}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleReset} className='flex flex-col max-w-sm mx-auto p-4 gap-4'>
      <h2 className='text-4xl font-semibold'>Reset Your Password</h2>
      <input 
        type="password"
        placeholder='New Password'
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit' className='border text-white py-2 rounded'>
        Update Password
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
