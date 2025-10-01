import { useState } from 'react';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PassKey = ({ handleOnClose }) => {
  const [passKey, setPassKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const adminPass = import.meta.env.VITE_ADMIN_PASS;

  const handleContinue = async () => {
    // setIsLoading(true)
    setMessage('');

    if (!passKey.trim()) {
      toast.error('Enter a Valid Passkey');
      setMessage('Enter a valid Passkey')
      setTimeout(() => {
        setMessage('')
      }, 4000);
      return;
    }

    setIsLoading(true);

    try {
      await toast.promise(
        (async () => {
          if (passKey === adminPass) {
            sessionStorage.setItem('admin-key', adminPass);
            setMessage('Verified! Redirecting...');
            setIsLoading(false);
            handleOnClose();
            navigate('/admin');
          } else {
            setIsLoading(true);
            setMessage('Wrong PassKey, Try Again!')
            setTimeout(() => {
              setMessage('');
              setPassKey('');
            }, 2000);
            setIsLoading(false)
            throw new Error('Wrong Passkey, Try Again!');
          }
        })(),
        {
          loading: 'Verifying',
          error: 'Wrong PassKey, Try Again!',
          success: 'Verified! Redirecting'
        }
      );
    } catch (error) {
      console.error('Wrong PassKey, Try Again!');
      setMessage('Wrong PassKey, Try Again!');
      setTimeout(() => {
        setPassKey('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-w-[350px] h-full overflow-y-hidden bg-white/80 rounded-3xl p-5'>
      <div className='flex justify-center items-center w-full'>
        <section id='token-verification' className='flex flex-col w-full p-2'>
          <button className='flex float-right -mt-2 items-center w-full text-shadow-md justify-end'>
            <XIcon 
              className='p-0.5 bg-gray-500 rounded-full cursor-pointer' 
              size={35}
              onClick={() => handleOnClose()} 
              disabled={isLoading}
            />
          </button>
          <h3 className="mb-3 text-3xl text-center font-bold text-gray-900">Verify Passkey</h3>

          <label htmlFor="passkey" className='mb-2 text-lg text-start font-semibold text-gray-900'>
            Enter Passkey to verify <span className="text-red-700 font-black">*</span>
          </label>
          <input 
            type="text"
            id='passkey'
            // style={{ marginTop: '5px' }}
            required
            placeholder='Enter admin passkey'
            value={passKey}
            onChange={(e) => setPassKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleContinue()}
            disabled={isLoading}
            className={`flex items-center w-full px-5 py-4 mr-2 mt-1.5 text-base font-medium outline-0 mb-5 placeholder:text-gray-500 rounded-2xl ${
              isLoading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'focus:bg-gray-400 bg-gray-400 text-gray-900'
            }`}
          />

          <button
            type='button'
            onClick={handleContinue}
            disabled={isLoading}
            className={`
              w-full cursor-pointer mx-auto px-6 py-5 mb-2 text-sm font-bold leading-0 text-white transition duration-300 rounded-2xl ${isLoading ? 'bg-indigo-500 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300'}
            `}
          >
            <span>
              {isLoading ? 'verifying' : 'Continue'}
            </span>
          </button>
          <span>
            {message && <p className='text-base text-center font-normal text-red-500 mx-auto mt-2'>{message}</p>}
          </span>
          <div className='mt-2 flex justify-center'>
            {isLoading && (
              <span className='w-6 h-6 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin'></span>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default PassKey