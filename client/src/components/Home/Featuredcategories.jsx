// import { useEcommerce } from "../../hooks/useEcommerce"

const FeaturedCategories = () => {
  // const { products } = useEcommerce();

  const categories = [
    { id: 1, briefText: 'Shine with our vibrant lip gloss collection', title: 'Lip Gloss', className: 'lip-gloss' },
    { id: 2, briefText: 'Shine with our vibrant lip gloss collection', title: 'Lip Gloss', className: 'lip-gloss' },
    { id: 3, briefText: 'Nourish your skin with our gentle skincare line', title: 'Skincare', className: 'skin-care' },
    { id: 4, briefText: 'Nourish your skin with our gentle skincare line', title: 'Skincare', className: 'skin-care' }
  ];

  return (
    <div className='w-full h-full py-5'>
      <div className="w-[96%] my-0 mx-auto py-4 rounded-xl bg-[#a19293]">
        <h2 class="text-[#181113] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 ml-5">Featured Categories</h2>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
          <div class="flex items-stretch gap-3 w-full px-4 md:px-6 category-scroll">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col gap-3 p-2 w-fit h-fit rounded-xl grow bg-[#ebdde0]">
                <div className={`w-full h-64 bg-center bg-no-repeat aspect-[3/3] bg-cover rounded-xl ${category.className}`}></div>
                <div className='ml-1'>
                  <p class="text-[#181113] text-base font-medium leading-normal">{category.title}</p>
                  <p class="text-gray-700 text-sm font-normal leading-normal block">{category.briefText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCategories