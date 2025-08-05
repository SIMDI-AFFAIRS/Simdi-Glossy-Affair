import React from 'react';
import Dashboard from '../components/Admin/Dashboard';
import AdminDashContextProvider from '../context/AdminDashContext';

const AdminPage = () => {
  return (
    <div>
      <AdminDashContextProvider>
        <Dashboard />
      </AdminDashContextProvider>
    </div>
  )
}

export default AdminPage