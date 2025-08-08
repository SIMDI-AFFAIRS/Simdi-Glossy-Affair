import { useState } from 'react';
import useEcommerce from '../../context/EcommerceContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogIn = () => {
  const { login } = useEcommerce();
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message, setMessage]= useState('');
  const [loading, setLoading] = useState(false);
  // const [clickedForgetPassword, setClickedForgetPassword] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (clickedForgetPassword) {

  //   }
  // }, []);

  const handleLogIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await toast.promise(
        (async () => {
          const user = await login({ email, password });
          setMessage('Logged in Successfully!');

          if (user) {
            navigate('/profile');
          } else {
            console.log('Failed to navigate user', user);
          }
        })(),
        {
          loading: 'Logging In...',
          error: '',
          success: 'Logged in successfully!'
        }
      )
    } catch (err) {
      console.error(err);
      setMessage(err);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <>
      <section className='py-5 px-6 flex flex-col items-center justify-center gap-8 bg-[#5a5353]'>
        <div className="max-w-md mx-auto rounded-2xl mt-10 p-6 bg-[#d1b8b8] shadow-lg shadow-gray-400 mb-5">
          <h2 className="text-xl font-bold mb-4">Log In</h2>
          <form onSubmit={handleLogIn} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            {message && <div className="text-red-600 text-sm">{message}</div>}
            <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className='mt-3'>
            <Link to='/forgot-password' className='text-gray-800 cursor-pointer font-semibold tracking-wide text-shadow-md hover:text-black transition-all duration-100'>Forgot Password?</Link>
          </div>

          <div className='flex flex-col items-center justify-center mt-5'>
            <h3 className='text-lg'>Not yet Registered? <Link to='/signup' className='text-blue-800 font-semibold'>Sign Up</Link></h3>
            </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;