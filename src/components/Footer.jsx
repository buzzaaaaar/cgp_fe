import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative bg-green-950 text-white overflow-hidden mt-0">
      <div className="flex flex-col md:flex-row min-h-[300px] relative">
        {/* Left Section with Wider Half-Circle on the Left */}
        <div className="relative w-full md:w-1/2 bg-white clip-left-footer flex items-center justify-start pl-6">
          <img
            src="Images/RankmeoneNavbarLogo2.png"
            alt="RankMeOne Logo"
            className="h-28 md:h-80 w-auto"
          />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 py-10 text-sm md:text-base text-gray-200">
          <div>
            <h3 className="font-bold mb-2">RANKMEONE →</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-green-400">SEO Tools</a></li>
              <li><a href="#" className="hover:text-green-400">Projects</a></li>
              <li><Link to="/calendar" className="hover:text-green-400">Calendar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">COMPANY →</h3>
            <ul className="space-y-1">
              <li><Link to="/AboutUs" className="hover:text-green-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-400">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-green-400">Terms and Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-green-400">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">SUPPORT →</h3>
            <ul className="space-y-1">
              <li><Link to="/faq" className="hover:text-green-400">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className="absolute bottom-4 right-16 text-sm text-green-400 text-right">
          Copyright © 2025 | Powered by the NSBM Green University Computing Group Project Group 33
        </div>
      </div>

      {/* Custom Wider Half-Circle Shape on the Left Side of the Left Section */}
      <style>
        {`
          .clip-left-footer {
            clip-path: ellipse(70% 100% at 0% 50%);
            height: 100%;
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;
