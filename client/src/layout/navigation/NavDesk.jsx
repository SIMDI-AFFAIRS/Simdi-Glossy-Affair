import { Link, NavLink } from 'react-router-dom';
import { routes } from './routes';
import useEcommerce from '../../context/EcommerceContext';

const NavDesk = () => {
  const { cartTotal } = useEcommerce();

  return (
    <>
      <div className="flex items-center gap-8">
        <Link to='/' className="flex items-center gap-3 text-[#181113]">
          {/* Logo */}
          <div className="size-7">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em]">Simdi's Glossy Affair</h2>
        </Link>
        <div className="flex items-center gap-8 border py-2 px-4 rounded-xl bg-[#f4f0f2]">
          {routes.map((route) => {
            const { title, to } = route;
            return (
              <NavLink key={title} className="desk-nav" to={to}>{title}</NavLink>
            )
          })}
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        {/* Search Bar */}
        {/* <label className="flex flex-col min-w-28 !h-10 max-w-64">
          <div className="flex w-full flex-1 rounded-xl border border-gray-400 h-full min-[768px]:ml-3 max-[888px]:ml-0">
            <div
              className="text-[#88636f] flex border-none bg-[#f4f0f2] items-center justify-center pl-4 rounded-l-xl border-r-0"
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
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border-none bg-[#f4f0f2] focus:border-none h-full placeholder:text-[#88636f] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value=""
            />
          </div>
        </label> */}
        <div className="flex gap-2">
          {/* <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f4f0f2] text-[#181113] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
          >
            <div className="text-[#181113]" data-icon="MagnifyingGlass" data-size="20px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                ></path>
              </svg>
            </div>
          </button> */}
          {/* Profile Bar */}
          <NavLink
            to='/profile'
            className="flex max-w-[480px] border border-gray-400 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f4f0f2] text-[#181113] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
          >
            <div className="text-[#181113]" data-icon="User" data-size="20px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                ></path>
              </svg>
            </div>
          </NavLink>

          {/* Cart Bar */}
          <NavLink
            to='/cart'
            className={`flex max-w-[480px] border ${ cartTotal > 0 ? 'border-t-transparent px-4' : 'px-2.5' } border-gray-400 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f4f0f2] text-[#181113] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 relative`}
          >
            <div className={`text-[#181113] ${cartTotal > 0 ? 'relative top-1' : ''}`} data-icon="ShoppingBag" data-size="20px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                ></path>
              </svg>
            </div>

            {
              cartTotal > 0 && (
                <div className='fixed top-1 !z-[150] text-[16px] font-medium font-mono text-[#085e16] text-shadow-2xs text-shadow-rose-800'>
                  <span className='flex items-center justify-center w-[50px] h-[20px] border border-gray-400 border-b-transparent border-x-transparent rounded-full'>
                    {cartTotal}
                  </span>
                </div>
              )
            }
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default NavDesk