import { Link } from "react-router-dom";

const NoUser = ({ userText }) => {
  return (
    <section className="p-10 bg-[#ac9f9f]">
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white/80 rounded-xl px-6 py-10 shadow-md max-w-md mx-auto text-white">
        <h2 className="text-2xl font-semibold text-[#181113] mb-4">You're not logged in</h2>
        <p className="text-[#2b2325] mb-6">To view your {userText} and start shopping, please log in or create an account.</p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 border border-white bg-[#574f4f] text-white rounded-full hover:bg-[#a27575] transition"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 border border-[#807676] text-[#1a1818] rounded-full hover:bg-[#c5a6a6] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NoUser;