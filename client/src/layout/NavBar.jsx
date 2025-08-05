import NavMobile from './navigation/NavMobile';
import NavDesk from './navigation/NavDesk';

const NavBar = () => {
  return (
    <section id='Navbar' className='fixed z-50 w-full bg-white/80 backdrop-blur-2xl -mt-0.5 md:-mt-0'>
      <div className="flex h-full grow flex-col bg-white/80">
        <header className='flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f0f2] px-7 py-2 md:py3'>
          <div id='mobile-screen-nav' className='block md:hidden w-full'>
            <NavMobile />
          </div>
          <div id='desktop-screen-nav' className='hidden md:flex w-full'>
            <NavDesk />
          </div>
        </header>
      </div>
    </section>
  )
}

export default NavBar