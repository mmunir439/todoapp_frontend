import Link from 'next/link';
import { FaHome, FaTasks, FaUserPlus, FaSignInAlt, FaPlusCircle, FaUser } from 'react-icons/fa';
import { getToken, decodeToken } from '@/app/utils/token';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(decodeToken(token));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <nav className="bg-green-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaTasks className="text-3xl" />
          <Link href="/" className="text-2xl font-extrabold hover:underline">
            TodoApp
          </Link>
        </div>

        <div className="flex flex-wrap space-x-6 mt-4 md:mt-0">
          <Link href="/" className="flex items-center space-x-1 hover:underline">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link href="/addtask" className="flex items-center space-x-1 hover:underline">
            <FaPlusCircle />
            <span>Add Todo</span>
          </Link>
          <Link href="/register" className="flex items-center space-x-1 hover:underline">
            <FaUserPlus />
            <span>Register</span>
          </Link>
          <Link href="/login" className="flex items-center space-x-1 hover:underline">
            <FaSignInAlt />
            <span>Login</span>
          </Link>
      </div>
    </div>
    </nav >
  );
};

export default Navbar;