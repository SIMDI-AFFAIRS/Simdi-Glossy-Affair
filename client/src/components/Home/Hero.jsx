import React from 'react';
import { Link } from 'react-router-dom';
// import img from '../../../public/img/hero/'

const Hero = () => {
  return (
    <section className="w-[93%] md:w-full h-full relative mx-auto md:mx-0 overflow-y-hidden">
      <div className="flex size-full flex-col bg-transparent group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
      
          <div className="px-0 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-7xl flex-1">
              <div className="@container shadow-2xl shadow-gray-300 rounded-xl">
                {/* <div className=""> */}
                  <div
                    className="flex rounded-xl min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-start justify-end px-4 py-5 md:pb-10 md:px-10 heroB object-contain"
                    // style={{ backgroundImage: 'url(../../../public/img/hero/heroBg.png)' }} bg-gradient-to-b from-black/10 to-black/40 bg-[url(../../../public/img/hero/heroBg.png)]
      
                  >
                    <div className="flex flex-col gap-2 text-left">
                      <h1
                        className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl @[480px]:font-black md:leading-tight md:tracking-[-0.033em]"
                      >
                        Radiant Beauty, Naturally You
                      </h1>
                      <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal w-full md:w-[60%]">
                        Discover our curated collection of lip glosses and skincare essentials, <span className='hidden md:inline'>designed to enhance your natural glow. Experience the difference with our new product</span>
                        launch.
                      </h2>
                    </div>
                    <Link to='/shop'
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#ea477d] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                    >
                      <span className="truncate">Shop New Arrivals</span>
                    </Link>
                  </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero