import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-orange-500 text-white py-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <p className="text-sm font-semibold">&copy; 2025 TodoApp. All rights reserved.</p>
          <nav className="flex space-x-4">
            <Link href="/about" className="hover:underline text-orange-200">About</Link>
            <Link href="/contact" className="hover:underline text-orange-200">Contact</Link>
            <Link href="/terms" className="hover:underline text-orange-200">Terms</Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex space-x-4">
          <Link href="https://portfolio-pi-sable-61.vercel.app/">Portfolio</Link>
          
           <Link href="https://www.linkedin.com/in/munirdev/">LinkedIn</Link>
           <Link href="https://github.com/mmunir439">Github</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;