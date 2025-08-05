import Hero from "../components/Home/Hero";
import FeaturedCategories from "../components/Home/Featuredcategories";
import CustomerFavorites from "../components/Home/CustomerFavorites";
import ParallelBelt from "../components/Home/ParallelBelt";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#dbcccc] to-[#bda6a6]">
      <Hero />
      {/* <div className="-mt-[24rem] md:-mt-0 px-6">
        <ParallelBelt />
      </div> */}
      <FeaturedCategories />
      <CustomerFavorites />
    </div>
  )
}

export default HomePage