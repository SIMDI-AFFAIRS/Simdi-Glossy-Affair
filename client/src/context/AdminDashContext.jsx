import { createContext, useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom";



const DashboardContext = createContext();

export const UseDashboardContext = () => useContext(DashboardContext);


const AdminDashContextProvider = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    // Stimulate authentication to check (replace wih real logic)
    const checkAccess = () => {
      const isLoggedIn = sessionStorage.getItem('admin-key');

      setIsAllowed(!!isLoggedIn);
    };

    checkAccess();
  }, []);

  if (isAllowed === null) {
    return <div className="p-10 text-center text-2xl text-black">Checking Access</div>; // Add loading spinner later
  }

  if (!isAllowed) {
    return <Navigate to='/shop' replace />
  }

  return (
    <DashboardContext.Provider value={{}}>
      {children}
    </DashboardContext.Provider>
  )
}

export default AdminDashContextProvider;