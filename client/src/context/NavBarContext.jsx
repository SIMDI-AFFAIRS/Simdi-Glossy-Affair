import { createContext, useState, useContext } from "react";

const NavBarContext = createContext();

export const NavBarProvider = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <NavBarContext.Provider value={{ isNavbarOpen, setIsNavbarOpen }}>
      {children}
    </NavBarContext.Provider>
  )
}

export const useNavbar = () => useContext(NavBarContext);