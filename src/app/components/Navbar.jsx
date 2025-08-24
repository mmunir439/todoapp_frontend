import Link from 'next/link';
import { FaHome, FaTasks, FaUserPlus, FaSignInAlt, FaPlusCircle, FaUser } from 'react-icons/fa';
import { getToken, decodeToken } from '@/app/utils/token';

const Navbar = () => {
  const token = getToken();
  const user = token ? decodeToken() : null; // Decode token to get user info

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-red-500 to-white text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <FaTasks className="text-3xl animate-spin" />
          <Link href="/" className="text-2xl font-extrabold hover:underline">
            TodoApp
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap space-x-6 mt-4 md:mt-0">
          <Link href="/" className="flex items-center space-x-1 hover:underline">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link href="/addtask" className="flex items-center space-x-1 hover:underline">
            <FaPlusCircle />
            <span>Add Todo</span>
          </Link>
          <Link href="/getalltasks" className="flex items-center space-x-1 hover:underline">
            <FaTasks />
            <span>All Todos</span>
          </Link>
          {user ? (
            <Link href="/userdashboard" className="flex items-center space-x-1 hover:underline">
              <FaUser />
              <span>{user.username}</span>
            </Link>
          ) : (
            <>
              <Link href="/register" className="flex items-center space-x-1 hover:underline">
                <FaUserPlus />
                <span>Register</span>
              </Link>
              <Link href="/login" className="flex items-center space-x-1 hover:underline">
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;