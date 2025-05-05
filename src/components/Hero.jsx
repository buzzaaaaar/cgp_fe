function Hero() {
    return (
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('Images/HomePageBackground.jpg')" }}
      >
        <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-4 mt-[-160px]">
          Welcome to content creator heaven!
        </h1>
        <p className="text-white text-sm md:text-base font-bold mb-6">
          Boost your content rankings with our wide range of search engine optimization tools,<br />
          manage your upcoming posts, and collaborate<br />
          all on one platform.
        </p>
        <a
          href="#"
          className="bg-white text-green-950 px-20 py-3 rounded-[15px] font-semibold text-sm md:text-base shadow hover:bg-gray-100 transition"
        >
          Get Started
        </a>
  
        {/* Cookie Notice */}
        <div className="absolute bottom-6 w-full flex justify-center px-4">
          <div className="w-full max-w-4xl bg-white rounded-[15px] shadow-lg p-6 font-sans">
            <div className="flex items-center mb-4">
              <img src="Images/CookieIcon.png" alt="Cookie Icon" className="w-6 h-6 mr-2" />
              <h2 className="text-[#7FAF37] font-bold text-lg">Cookie Settings</h2>
            </div>
            <p className="text-gray-700 font-bold mb-6">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
              By clicking “ACCEPT ALL”, you consent to our use of cookies.
            </p>
            <div className="flex justify-end space-x-4">
              <button className="bg-[#7FAF37] hover:bg-[#6c9b2f] text-white font-semibold px-6 py-2 rounded-[15px] transition">
                ACCEPT ALL
              </button>
              <button className="bg-[#7FAF37] hover:bg-[#6c9b2f] text-white font-semibold px-6 py-2 rounded-[15px] transition">
                REJECT ALL
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default Hero;
  