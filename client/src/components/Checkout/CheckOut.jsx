import React from 'react'

const CheckOut = () => {
  return (
    <div
      class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      // style='--checkbox-tick-svg: url(&apos;data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e&apos;); font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;'
    >
      <div class="layout-container flex h-full grow flex-col">
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
            <div class="flex flex-col gap-3 p-4">
              <div class="flex gap-6 justify-between"><p class="text-[#181113] text-base font-medium leading-normal">Shipping</p></div>
              <div class="rounded bg-[#e5dcdf]"><div class="h-2 rounded bg-[#181113]" style={{ width: '25%' }}></div></div>
            </div>
            <h3 class="text-[#181113] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">Shipping address</h3>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">Email</p>
                <input
                  placeholder="jane.doe@example.com"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">First name</p>
                <input
                  placeholder="Jane"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">Last name</p>
                <input
                  placeholder="Doe"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">Address</p>
                <input
                  placeholder="123 Main Street"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">Apartment, suite, etc. (optional)</p>
                <input
                  placeholder="Apt 4B"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">City</p>
                <input
                  placeholder="Anytown"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">Country/Region</p>
                <input
                  placeholder="United States"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">State</p>
                <input
                  placeholder="California"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label class="flex flex-col min-w-40 flex-1">
                <p class="text-[#181113] text-base font-medium leading-normal pb-2">Zip code</p>
                <input
                  placeholder="90210"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border border-[#e5dcdf] bg-white focus:border-[#e5dcdf] h-14 placeholder:text-[#88636f] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div class="px-4">
              <label class="flex gap-x-3 py-3 flex-row">
                <input
                  type="checkbox"
                  class="h-5 w-5 rounded border-[#e5dcdf] border-2 bg-transparent text-[#ea477d] checked:bg-[#ea477d] checked:border-[#ea477d] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#e5dcdf] focus:outline-none"
                />
                <p class="text-[#181113] text-base font-normal leading-normal">Save this information for next time</p>
              </label>
            </div>
            <div class="flex px-4 py-3">
              <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#ea477d] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span class="truncate">Continue to shipping</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut