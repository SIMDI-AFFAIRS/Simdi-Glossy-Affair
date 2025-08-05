import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

const PageNotFound = () => {
  return (
    <section className="text-center flex flex-col items-center justify-center h-96 py-14 mb-auto bg-[#d3d3d3]">
      <TriangleAlert size={80} className="text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
      <p className="text-xl mb-5">The Page you entered does not exist!</p>
      <Link to='/' className="text-white bg-indigo-700 rounded-md px-3 py-2 mt-4">Go Back</Link>
    </section>
  )
}

export default PageNotFound