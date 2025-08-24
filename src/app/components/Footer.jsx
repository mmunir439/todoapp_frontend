const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-500 via-red-500 to-white text-white py-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <p className="text-sm font-semibold">&copy; 2025 TodoApp. All rights reserved.</p>
          <nav className="flex space-x-4">
            <a href="/about" className="hover:underline text-orange-200">About</a>
            <a href="/contact" className="hover:underline text-orange-200">Contact</a>
            <a href="/terms" className="hover:underline text-orange-200">Terms</a>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;