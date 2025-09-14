import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminDashContextProvider from '../context/AdminDashContext';

const AdminPage = () => {
  return (
    <div>
      <AdminDashContextProvider>
        <AdminDashboard />
      </AdminDashContextProvider>
    </div>
  )
}

export default AdminPage