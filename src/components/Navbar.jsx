import { useEffect } from 'react';

function Navbar() {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-6 py-1">
      <div className="flex items-center justify-between h-[60px]">
        <div className="flex items-center space-x-10">
          <img src="Images/RankmeoneNavbarLogo.png" alt="RankMeOne Logo" className="h-16 w-auto" />
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 font-medium hover:text-green-700">SEO Tools</a>
            <a href="#" className="text-gray-700 font-medium hover:text-green-700">Projects</a>
            <a href="#" className="text-gray-700 font-medium hover:text-green-700">Calendar</a>
          </div>
        </div>
        <div className="flex items-center space-x-4" x-data="{ showNotif: false, showProfile: false }">
          <div className="relative">
            <button className="text-gray-700 hover:text-green-700">
              <i data-lucide="bell" className="w-6 h-6"></i>
            </button>
          </div>
          <div className="relative">
            <button className="bg-green-950 text-white w-9 h-9 rounded-full font-semibold flex items-center justify-center">
              R
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
