import { useState } from 'react';
import { Link } from 'react-router-dom';
import useEcommerce from '../../context/EcommerceContext';
import toast from 'react-hot-toast';

const SignUp = () => {
  const { signup } = useEcommerce();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await toast.promise(
        (async () => {
          await signup(email, password, () => {
            setShowConfirmation(true);
          });
          setMessage('Signup successfully! Please check your email to activate your account');
        })(),
        {
          loading: 'Signing up...',
          error: 'Signup failed, try again!',
          success:'Signup Successfully!'
        }
      )
    } catch (error) {
      console.error(error);
      setMessage('Signup failed, try again!');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  if (showConfirmation) {
    return (
      <section className='py-5 px-6 flex flex-col items-center justify-center gap-8 bg-gradient-to-tr from-[#a75e5eb3] to-[#ac9f9f]'>
        <div className="max-w-md mx-auto mt-10 p-4 md:p-6 bg-[#d1b8b8] rounded-2xl shadow-lg shadow-gray-600 mb-5">
          <div className='flex flex-col items-center justify-center'>
            <h2 className='text-2xl font-bold text-gray-800'>Account Created!</h2>
            <p className='mt-4 text-[1.05rem] wrap-anywhere'>
              PLease check you email <span className='text-red-700 text-shadow-md text-shadow-gray-400 font-semibold'>(including spam)</span> to confirm and activate your account.
              You can <Link to='/login' className='text-blue-800 text-shadow-md text-shadow-gray-400 underline underline-offset-4 font-semibold'>Log In</Link> afterwards!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className='py-5 px-6 flex flex-col items-center justify-center gap-8 bg-[#5a5353]'>
        <div className="max-w-md mx-auto mt-10 p-6 bg-[#d1b8b8] rounded-2xl shadow-lg shadow-gray-100 mb-5">
          <h2 className="text-xl font-bold mb-4">Create Your Profile</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            /> */}
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
            <button type="submit" className={`bg-pink-600 text-white px-4 py-2 rounded w-full ${ loading ? 'cursor-not-allowed' : 'cursor-pointer' }`} disabled={loading}>
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </form>

          <div className='flex flex-col mt-5'>
            <h3 className='text-lg'>Already have an account? <Link to='/login' className='text-blue-800'>Log In</Link></h3>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;