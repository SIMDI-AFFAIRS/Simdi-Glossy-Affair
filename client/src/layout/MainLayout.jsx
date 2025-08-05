import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useNavbar } from "../context/NavBarContext";

const MainLayout = () => {
  const { isNavbarOpen } = useNavbar();

  return (
    <section id="layout">
      <NavBar />
      {/* <main className=""> */}
      <main className={`pt-[3.7rem] ${isNavbarOpen ? 'blur-sm cursor-none transition-all duration-300 pointer-events-none' : ''}`}>
        <Outlet />
      </main>
      <Footer className={`${isNavbarOpen ? 'blur-sm cursor-none transition-all duration-300 pointer-events-none' : ''}`} />
    </section>
  )
}

export default MainLayout

// Come back later to set the state of footer id navbar is open