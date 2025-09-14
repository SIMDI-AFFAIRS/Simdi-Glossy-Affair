import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Divide as Hamburger } from 'hamburger-react';
import { routes } from './routes';
import { useNavbar } from '../../context/NavBarContext';
// import NavMobile from '../../../../../portfolio/client/src/components/layout/navigation/NavBar';

const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const { isNavbarOpen, setIsNavbarOpen } = useNavbar();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsNavbarOpen(!isNavbarOpen);
    setIsHamburgerOpen(!isOpen); // Sync hamburger with the menu
    setIsHamburgerOpen(!isNavbarOpen);
  };

  const handleNavClick = (e) => {
    // e.preventDefault();

    // if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.currentTarget === e.target) {
      setIsOpen(false);
      setIsNavbarOpen(false);
      setIsHamburgerOpen(false);
      console.log('Clicked a navigation')
    // }
  };

  return (
    <div className='w-full h-full transition-all duration-300 ease-in-out relative'>
      <div className="flex items-center justify-between">
        <Link to='/' className="flex items-center gap-3 text-[#181113]">
          {/* Logo */}
          <div className="size-7">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="#ff007f"
              ></path>
            </svg>
          </div>
          <h2 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em]">Simdi's Glossy Affair</h2>
        </Link>
        <button onClick={toggleMenu} className='cursor-pointer'>
          <Hamburger toggle={setIsHamburgerOpen} toggled={isHamburgerOpen} size={25} label='Menu Bar' />
        </button>
      </div>

      {/* Animated mobile navbar */}
      <div
        className={`fixed !z-[100] top-[4rem] left-0 h-full w-2/4 max-w-x rounded-br-2xl shadow-lg transition-transform duration-500 ease-in-out ${isOpen || isNavbarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ boxShadow: isOpen || isNavbarOpen ? '20px 0 16px rgba(0,0,0,0.08)' : 'none' }}
        // onClick={handleNavClick}
      >
        <div className='backdrop-blur-2xl bg-black/100 rounded-br-2xl'>
          <div className='flex flex-col gap-8 py-8 px-6 bg-white/60 rounded-br-2xl'>
            {/* <label className="flex flex-col max-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#fff] flex border-none bg-gray-400 items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                    ></path>
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#fff] focus:outline-0 focus:ring-0 border-none bg-gray-400 focus:border-none h-full placeholder:text-[#fff] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value="search"
                />
              </div>
            </label> */}

            {/* Navbar */}
            {routes.map((route) => {
              const { title, to } = route;
              return(
                <NavLink className='w-28 mx-auto border text-center px-5 py-2 rounded-xl hover:scale-105 transition-all duration-150' key={title} to={to} onClick={handleNavClick}>
                  <span className="w-full" >{title}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavMobile