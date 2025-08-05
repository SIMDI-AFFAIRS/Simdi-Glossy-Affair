import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [coolDown, setCoolDown] = useState(0);

  const handleSend = async (e) => {
    e.preventDefault();

    if (coolDown > 0) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:1500/reset-password',
    });

    if (error) {
      setMessage('Error sending Reset link');
      toast.error('Error sending Reset link');
    } else {
      setMessage('Reset Link sent! Check your email');
      toast.success('Reset Link sent! Check your email');
      setCoolDown(60); // 60 seconds coolDown

      const timer = setInterval(() => {
        setCoolDown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        })
      }, 1000);
    }
  };

  return (
    <section className='py-5 px-3 flex flex-col items-center justify-center gap-8 bg-[#5a5353]'>
      <div className="min-w-[300px] max-w-sm mx-auto mt-10 rounded-2xl p-6 bg-[#d1b8b8] shadow-lg shadow-gray-400 mb-5">
        <h2 className="text-xl font-bold mb-4">Account Recovery</h2>
        <form onSubmit={handleSend} className="space-y-4 w-full min-w-[300px] sm:min-w-[350px]">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          {/* <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          /> */}
          {message && <div className="text-red-600 text-sm">{message}</div>}
          <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded w-full" disabled={coolDown > 0}>
            {coolDown ? `Wait ${coolDown}` : 'Send Reset Link'}
          </button>
        </form>
        <div className='mt-3'>
          <Link to='/login' className='text-gray-800 cursor-pointer font-semibold tracking-wide text-shadow-md hover:text-black transition-all duration-100'>Log In to your account?</Link>
        </div>

        <div className='flex flex-col items-center justify-center mt-5'>
        <h3 className='text-lg'>Not yet Registered? <Link to='/signup' className='text-blue-800 font-semibold'>Sign Up</Link></h3>
        </div>
      </div>
    </section>
  )
}

export default ForgetPassword