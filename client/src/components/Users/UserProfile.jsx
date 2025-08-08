import { useEffect, useState } from 'react';
import useEcommerce from '../../context/EcommerceContext';
import { LogOutIcon, Mail, Phone } from 'lucide-react';
import NoUser from './NoUser';

const UserProfile = () => {
  const {
    user,
    userProfile,
    fetchUserProfile,
    updateProfile,
    deleteProfile,
    logout,
  } = useEcommerce();

  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setForm({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
      setLoading(false);
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    setEditMode(false);
  };

  const handleDelete = async () => {
    await deleteProfile();
  };

  if (!userProfile) {
    return (
      <NoUser userText='profile' />
    )
  }

  return (
    <section className='flex flex-col items-center justify-center mx-auto p-10 bg-gradient-to-tr from-[#a75e5eb3] to-[#ac9f9f]'>
      <div className='min-w-[70vw] md:min-w-[50vw] py-5 border rounded-xl bg-[#f3dbdb] flex flex-col items-center justify-center'>
        <h2 className='mb-5 text-2xl md:text-4xl font-semibold font-mono tracking-tight'>Profile</h2>
        <div className='w-full h-full flex px-5 flex-col md:flex-row'>
          <section className="w-full h-full flex items-center justify-center">
            <div className='w-32 h-32 border rounded-full mb-5'>
              <img
                className='w-full h-full rounded-full bg-center'
                src="/img/shopItems/SophiaBennett.png"
                alt="pfp"
              />
            </div>
          </section>
          {!editMode ? (
            <section className='mt-5 w-full flex flex-col items-start justify-start gap-3'>
              <p>Name: {form.full_name}</p>
              <span className='flex flex-row items-center'><Mail className='size-5 mr-1' /> {form.email}</span>
              <span className='flex flex-row items-center'><Phone className='size-5 mr-1' /> {form.phone}</span>

              <div className="flex items-start flex-col gap-4 mt-4">
                <button onClick={() => setEditMode(true)} className="underline cursor-pointer">Edit</button>
                <button onClick={logout} className="flex items-center gap-1 cursor-pointer">
                  <LogOutIcon className='size-5' />
                  <span>Log Out</span>
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-1 w-full">
              Name: <input name="full_name" value={form.full_name} onChange={handleChange} className="border p-1.5 w-full rounded-lg" />
              Email: <input name="email" value={form.email} disabled onChange={handleChange} className="border p-1.5 w-full rounded-lg cursor-not-allowed" />
              Phone: <input name="phone" value={form.phone} onChange={handleChange} className="border p-1.5 w-full rounded-lg" />
              <div className="flex gap-3 mt-2">
                <button type="submit" className="bg-black cursor-pointer text-white px-4 py-2 rounded">Save</button>
                <button type="button" style={{ cursor: 'pointer' }} onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
