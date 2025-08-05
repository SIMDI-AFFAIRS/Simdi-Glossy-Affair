import { ArrowLeft } from 'lucide-react';

const ShopItems = ({ selectedItem, setSelectedItem }) => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#e4c8c8] group/design-root overflow-x-hidden" /* style='font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;' */>
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-wrap gap-2 p-4 mt-2">
          <span className='flex items-center justify-center space-x-0.5 flex-row text-[#4e3a40]'>
            <ArrowLeft className='size-5' />
            <span className="text-base font-medium leading-normal" onClick={() => setSelectedItem(null)} style={{ cursor: 'pointer' }}>Shop</span>
          </span>
          <span className="text-[#88636f] text-base font-medium leading-normal">/</span>
          <span className="text-[#181113] text-base font-medium leading-normal">{selectedItem.title}</span>
        </div>
        <div className="px-10 flex flex-1 justify-center py-3">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h2 className="text-[#181113] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">{selectedItem.title}</h2>
            <p className="text-[#181113] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {/* Experience the ultimate shine and hydration with our Radiant Lip Gloss. This non-sticky formula glides on smoothly, leaving your lips feeling soft and looking
              luminous. Available in a range of stunning shades to complement any look. */}
              {selectedItem.intro}
            </p>
            <div className="flex w-full grow bg-white @container p-4 rounded-xl">
              <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-xl grid grid-cols-[2fr_1fr_1fr]">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none row-span-2 lip-gloss-1"
                  style={{ backgroundImage: `url(${selectedItem.itemImg1})` }}
                ></div>
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none col-span-2 lip-gloss-2"
                  style={{ backgroundImage: `url(${selectedItem.itemImg2})` }}
                ></div>
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none col-span-2 lip-gloss-3"
                  style={{ backgroundImage: `url(${selectedItem.itemImg3})` }}
                ></div>
              </div>
            </div>
            <h3 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Product Details</h3>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6 max-w-[70%]">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#141414] py-5">
                <p className="text-gray-800 text-[1rem] md:text-lg font-normal leading-normal">Shade</p>
                <p className="text-[#181113] text-center text-[1rem] md:text-lg font-normal leading-normal">{/* Rose Petal */}{selectedItem.productDetails.shade}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#141414] py-5">
                <p className="text-gray-800 text-[1rem] md:text-lg font-normal leading-normal">Finish</p>
                <p className="text-[#181113] text-center text-[1rem] md:text-lg font-normal leading-normal">{/* Glossy */} {selectedItem.productDetails.finish}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#141414] py-5">
                <p className="text-gray-800 text-[1rem] md:text-lg font-normal leading-normal">Size</p>
                <p className="text-[#181113] text-center text-[1rem] md:text-lg font-normal leading-normal">{/* 0.15 fl oz */} {selectedItem.productDetails.size}</p>
              </div>
            </div>

            {/* Ingredients */}
            {/* <div>
              <h3 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Ingredients</h3>
              <p className="text-[#181113] text-base font-normal leading-normal pb-3 pt-1 px-4">
                Our Radiant Lip Gloss is formulated with nourishing ingredients like shea butter and vitamin E to keep your lips healthy and hydrated. Full ingredients list:
                Polybutene, Octyldodecanol, Silica Dimethyl Silylate, Mica, Butyrospermum Parkii (Shea) Butter, Tocopheryl Acetate, Flavor (Aroma), Benzyl Alcohol, Benzyl Benzoate,
                Limonene, Linalool, [+/- May Contain: Titanium Dioxide (CI 77891), Iron Oxides (CI 77491, CI 77492, CI 77499), Red 6 (CI 15850), Red 7 Lake (CI 15850), Yellow 5 Lake
                (CI 19140), Blue 1 Lake (CI 42090)].
              </p>
            </div> */}

            <h3 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">How to Use</h3>
            <p className="text-[#181113] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {/* Apply directly to lips for a natural, glossy finish. For a more defined look, line lips with a lip pencil before applying gloss. Reapply as needed throughout the day. */}
              {selectedItem.howToUse}
            </p>

            {/* Customer reviews */}
            {/* <section id='customer-reviews'>
              <h3 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Customer Reviews</h3>
              <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
                <div className="flex flex-col gap-2">
                  <p className="text-[#181113] text-4xl font-black leading-tight tracking-[-0.033em]">4.5</p>
                  <div className="flex gap-0.5">
                    <div className="text-[#181113]" data-icon="Star" data-size="18px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="18px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="18px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="18px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="18px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[#181113] text-base font-normal leading-normal">125 reviews</p>
                </div>
                <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
                  <p className="text-[#181113] text-sm font-normal leading-normal">5</p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#e5dcdf]"><div className="rounded-full bg-[#181113]" style={{width: '40%'}}></div></div>
                  <p className="text-[#88636f] text-sm font-normal leading-normal text-right">40%</p>
                  <p className="text-[#181113] text-sm font-normal leading-normal">4</p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#e5dcdf]"><div className="rounded-full bg-[#181113]" style={{width: '30%'}}></div></div>
                  <p className="text-[#88636f] text-sm font-normal leading-normal text-right">30%</p>
                  <p className="text-[#181113] text-sm font-normal leading-normal">3</p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#e5dcdf]"><div className="rounded-full bg-[#181113]" style={{width: '15%'}}></div></div>
                  <p className="text-[#88636f] text-sm font-normal leading-normal text-right">15%</p>
                  <p className="text-[#181113] text-sm font-normal leading-normal">2</p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#e5dcdf]"><div className="rounded-full bg-[#181113]" style={{width: '10%'}}></div></div>
                  <p className="text-[#88636f] text-sm font-normal leading-normal text-right">10%</p>
                  <p className="text-[#181113] text-sm font-normal leading-normal">1</p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#e5dcdf]"><div className="rounded-full bg-[#181113]" style={{width: '5%'}}></div></div>
                  <p className="text-[#88636f] text-sm font-normal leading-normal text-right">5%</p>
                </div>
              </div>
              <div className="flex flex-col gap-8 overflow-x-hidden bg-white p-4">
                <div className="flex flex-col gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 sophiaBennett"
                      style={{ backgroundImage: `url(${'/img/shopItems/SophiaBennett.png'})` }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-[#181113] text-base font-medium leading-normal">Sophia Bennett</p>
                      <p className="text-[#88636f] text-sm font-normal leading-normal">2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[#181113] text-base font-normal leading-normal">
                    I absolutely love this lip gloss! The shade is perfect for everyday wear, and it feels so moisturizing on my lips. Definitely my new go-to!
                  </p>
                  <div className="flex gap-9 text-[#88636f]">
                    <button className="flex items-center gap-2">
                      <div className="text-inherit" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-inherit">25</p>
                    </button>
                    <button className="flex items-center gap-2">
                      <div className="text-inherit" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-inherit">5</p>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 oliviaCarter"
                      style={{ backgroundImage: `url(${'/img/shopItems/OliviaCarter.png'})` }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-[#181113] text-base font-medium leading-normal">Olivia Carter</p>
                      <p className="text-[#88636f] text-sm font-normal leading-normal">1 month ago</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#181113]" data-icon="Star" data-size="20px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-[#cebbc1]" data-icon="Star" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[#181113] text-base font-normal leading-normal">
                    The gloss is beautiful and gives a lovely shine. It's a bit sticky, but the color payoff and hydration make up for it. Will try other shades!
                  </p>
                  <div className="flex gap-9 text-[#88636f]">
                    <button className="flex items-center gap-2">
                      <div className="text-inherit" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-inherit">18</p>
                    </button>
                    <button className="flex items-center gap-2">
                      <div className="text-inherit" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-inherit">3</p>
                    </button>
                  </div>
                </div>
              </div>
            </section> */}

            {/* <section id='related-product' className='w-full h-fit p-4 border relative overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden'>
              <h3 className="text-[#181113] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Related Products</h3>
              <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
                <div className="flex items-stretch p-4 gap-3">
                  <div className="flex h-full flex-1 flex-col gap-4 min-w-40 p-2 w-fit rounded-xl grow bg-[#beb9b9]">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col hydratingFaceSerum"
                      style={{ backgroundImage: `url(${'/img/shopItems/HydratingFaceSerum.png'})` }}
                    ></div>
                    <div>
                      <p className="text-gray-950 text-base font-medium leading-normal">Hydrating Face Serum</p>
                      <p className="text-gray-700 text-sm font-normal leading-normal">A lightweight serum for radiant skin.</p>
                    </div>
                  </div>
                  <div className="flex h-full flex-1 flex-col gap-4 min-w-40 p-2 w-fit rounded-xl grow bg-[#beb9b9]">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col matteLipstick"
                      style={{ backgroundImage: `url(${'/img/shopItems/MatteLipstick.png'})` }}
                    ></div>
                    <div>
                      <p className="text-gray-950 text-base font-medium leading-normal">Matte Lipstick</p>
                      <p className="text-gray-700 text-sm font-normal leading-normal">Long-lasting color with a matte finish.</p>
                    </div>
                  </div>
                  <div className="flex h-full flex-1 flex-col gap-4 min-w-40 p-2 w-fit rounded-xl grow bg-[#beb9b9]">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col dailyMoisturizer"
                      style={{ backgroundImage: `url(${'/img/shopItems/DailyMoisturizer.png'})` }}
                    ></div>
                    <div>
                      <p className="text-gray-950 text-base font-medium leading-normal">Daily Moisturizer</p>
                      <p className="text-gray-700 text-sm font-normal leading-normal">Protects and hydrates all day.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopItems