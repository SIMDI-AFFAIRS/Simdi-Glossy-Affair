import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = ('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase to auto login user from the token to reset password
    supabase.auth.getUser().then(({ data }) => {
      if (data.error) setShowForm(true);
    });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage('Error updating password');
      toast.error('Error updating password');
      // setMessage('Error updating password');
      // toast.error('Error updating password');
    } else {
      setMessage('Password updated! You can now log in.');
      toast.success('Password updated! You can now log in.');
      navigate('/login')
    }
  };

  if (showForm) return (
    <div className='min-h-[50vh] w-full h-full flex items-center justify-center bg-[#8f8b8b]'>
      <div className='w-32 h-32 border-8 border-indigo-600 border-t-transparent border-b-transparent rounded-full animate-spin'>
        {/* <p className='text-xl w-full h-full flex items-center justify-center fixed'>Loading...</p> */}
      </div>
    </div>
  )

  return (
    <section className='bg-[#ac9f9f] p-6 min-h-[40vh]'>
      <form onSubmit={handleReset} className='flex flex-col items-center justify-center max-w-sm mx-auto p-6 gap-4 bg-white/80 rounded-md'>
        <h2 className='text-2xl md:text-4xl font-semibold'>Reset Your Password</h2>
        <input
          type="password"
          placeholder='Enter New Password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={handleReset}
          className='w-full p-2 rounded-md border'
        />
        <button type='submit' className='border w-full py-2 rounded bg-gray-500 text-white cursor-pointer'>
          Update Password
        </button>
        {message && <p>{message}</p>}
      </form>
    </section>
  );
}
