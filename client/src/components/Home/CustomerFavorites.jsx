

const CustomerFavorites = () => {

  const customers = [
    {
      id: 1,
      title: 'Sarah M.',
      review: 'I love the lip gloss! It\'s so smooth and the colors are amazing.',
      className: 'sarah-m'
    },
    {
      id: 2,
      title: 'Emily R.',
      review: 'The skincare products have transformed my skin. It\'s never looked better!',
      className: 'emily-r'
    },
    {
      id: 3,
      title: 'Jessica L.',
      review: 'The quality of these products is unmatched. I highly recommend them.',
      className: 'jessica-l'
    }
  ];

  return (
    <section className="w-full h-full py-5">
      <div className="w-[96%] my-0 mx-auto p-5 rounded-xl bg-[#8f8789]">
        <h2 className="text-[#181113] text-[22px] font-bold leading-tight tracking-[-0.015em]">Customer Favorites</h2>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch py-4 gap-3">
            {customers.map((customer) => (
              <div key={customer.id} className="flex w-full h-full flex-1 flex-col gap-4 rounded-lg min-w-60 grow bg-white p-2">
              <div
                className={`w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col ${customer.className}`}
              ></div>
              <div>
                <p className="text-[#181113] text-base font-medium leading-normal">"{customer.review}"</p>
                <p className="text-[#88636f] text-sm font-semibold leading-normal">- {customer.title}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerFavorites;