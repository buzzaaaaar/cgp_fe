import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative bg-green-950 text-white overflow-hidden mt-0">
      <div className="flex flex-col md:flex-row min-h-[300px] relative">
        <div className="relative w-full md:w-1/2 bg-white clip-left-footer flex items-center justify-start pl-6">
          <img
            src="Images/RankmeoneNavbarLogo2.png"
            alt="RankMeOne Logo"
            className="h-28 md:h-80 w-auto"
          />
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-10 text-sm md:text-base text-gray-200">
          <div>
            <h3 className="font-bold mb-2">RANKMEONE →</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-green-400">SEO Tools</a></li>
              <li><a href="#" className="hover:text-green-400">Projects</a></li>
              <li><a href="#" className="hover:text-green-400">Calendar</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">COMPANY →</h3>
            <ul className="space-y-1">
              <li><Link to="/AboutUs" className="hover:text-green-400">About Us</Link></li>
              <li><a href="#" className="hover:text-green-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">SUPPORT →</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-green-400">FAQs</a></li>
            </ul>
          </div>
        </div>
        <div className="absolute bottom-4 right-16 text-sm text-green-400 text-right">
          Copyright © 2025 | Powered by the NSBM Green University Computing Group Project Group 33
        </div>
      </div>
      <style>
        {`
          .clip-left-footer {
            clip-path: circle(90% at 0% 50%);
            height: 100%;
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;
