import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Correcting the image imports
import TopicalMapGenerator from '../assets/TopicalMapGenerator.png';
import BlogPostIdeas from '../assets/BlogPostIdeas.png';
import SaveSuccessfulIcon from '../assets/savesuccessful.png';

export default function JSONLDFAQGenerator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [saveSuccessPopupVisible, setSaveSuccessPopupVisible] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [tempDesign, setTempDesign] = useState(null);
  const inputRef = useRef(null);

  const handleSaveClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    // Discard unsaved temp design on close
    setTempDesign(null);
    setIsPopupVisible(false);
  };

  const handleCreateNew = () => {
    const newId = Date.now();
    const newDesign = { id: newId, name: 'Untitled design', media: null };
    setTempDesign(newDesign);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const handleDone = () => {
    if (tempDesign) {
      setDesigns([...designs, tempDesign]);
      setTempDesign(null);
      setIsPopupVisible(false);  // Close the "Save to" popup
      setSaveSuccessPopupVisible(true);  // Show save success popup when done
    }
  };

  const handleTempNameChange = (e) => {
    setTempDesign((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleCloseSaveSuccessPopup = () => {
    setSaveSuccessPopupVisible(false); // Close the save success popup
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-white font-hanken sm:px-8">
      <Navbar />
      <div className="h-16"></div>

      <div className="mb-6">
        <h1 className="text-5xl font-extrabold text-[#7FAF37] mb-4">JSON-LD FAQ Generator</h1>
        <hr className="border-t border-gray-300" />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="w-full lg:w-2/3">
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-4xl px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter your target keyword..."
            />
            <div className="text-right text-sm text-[#013024] mt-1 max-w-4xl">
              {Math.min(searchQuery.trim().split(/\s+/).filter(Boolean).length, 15)}/15
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={8}
              className="w-full max-w-4xl p-4 text-base border border-gray-300 rounded-md resize-none focus:outline-none"
              placeholder=""
            ></textarea>
          </div>

          <div className="flex justify-end max-w-4xl mb-4">
            <button
              className="bg-[#7FAF37] text-white font-bold py-2 px-6 rounded-md text-sm uppercase border border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all duration-150"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>

          <div className="text-sm text-[#1C3D86] max-w-4xl">
            If you see a warning, the content may be inappropriate or unsuitable for SEO. Please try again.
          </div>
        </div>

        <div className="flex flex-col items-center w-full lg:w-1/3">
          <h2 className="text-xl font-semibold text-[#7FAF37] text-center mb-6">Related Tools</h2>

           {/* Blog Post Ideas */}
           <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white min-h-[150px] shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-2">
              <img src={BlogPostIdeas} alt="Blog Post Ideas" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">Blog Post Ideas</h3>
            </div>
            <p className="mb-2 text-sm text-gray-600">
            Get creative and engaging blog post ideas to keep your content fresh and search-engine friendly
            </p>
            <div className="text-sm text-[#013024] text-right cursor-pointer hover:underline hover:text-[#7FAF37]">Learn more</div>
          </div>

          {/* Topical Map Generator */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white min-h-[150px] shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-2">
              <img src={TopicalMapGenerator} alt="Topical Map Generator" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">Topical Map Generator</h3>
            </div>
            <p className="mb-2 text-sm text-gray-600">
            Build a structured content roadmap to target the right topics and strengthen your SEO
            </p>
            <div className="text-sm text-[#013024] text-right cursor-pointer hover:underline hover:text-[#7FAF37]">Learn more</div>
          </div>

          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold text-[#7FAF37] text-center mb-4">Advertisement</h2>
            <div className="aspect-[16/9]">
              <iframe
                className="w-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/A-93P640uFM?si=979BKqwC9n9MLzD_"
                title="Advertisement Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Save Successful Popup */}
      {saveSuccessPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl relative flex flex-col">
            {/* Close button above the horizontal line */}
            <button
              className="absolute text-2xl font-bold text-black top-2 right-2"
              onClick={handleCloseSaveSuccessPopup}
            >
              ×
            </button>

            {/* Horizontal line */}
            <hr className="border-t border-[#D4D4D4] mb-4" />
            
            {/* Save Successful Message */}
            <div className="flex items-center justify-center">
              <img src={SaveSuccessfulIcon} alt="Save Successful Icon" className="w-8 h-8 mr-2" />
              <p className="text-xl font-semibold text-[#013024]">Save Successful</p>
            </div>
          </div>
        </div>
      )}

      {/* Popup for Saving Designs */}
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-10 rounded-lg w-[1000px] min-h-[600px] shadow-xl relative flex flex-col">
            {/* Title */}
            <div className="flex justify-between items-center mb-4 border-b border-[#D4D4D4] pb-4">
              <h3 className="text-2xl font-semibold text-[#013024]">Save to</h3>
              <button className="text-2xl font-bold text-black" onClick={handleClosePopup}>
                ×
              </button>
            </div>

            {/* Subheading */}
            <h3 className="text-xl font-semibold text-[#7FAF37] mb-4">Designs</h3>

            {/* Content */}
            <div className="flex items-start flex-grow gap-4 mb-6 overflow-x-auto">
              {/* Create New Button */}
              <div className="flex-shrink-0">
                <button
                  className="bg-[#7FAF37] text-white font-bold py-3 px-6 rounded-md text-lg flex items-center justify-center border border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all duration-150"
                  onClick={handleCreateNew}
                >
                  <span className="mr-2">+</span> Create New
                </button>
              </div>

              {/* Saved Designs */}
              {designs.map((design) => (
                <div key={design.id} className="flex-shrink-0 w-48">
                  <div className="flex items-center justify-center w-48 h-48 mb-2 overflow-hidden bg-gray-200 rounded-md">
                    {design.media ? (
                      <img src={design.media} alt="Design" className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-500">Blank</span>
                    )}
                  </div>
                  <div className="text-base font-medium text-center">{design.name}</div>
                </div>
              ))}

              {/* Temp Design */}
              {tempDesign && (
                <div className="flex-shrink-0 w-48">
                  <div className="flex items-center justify-center w-48 h-48 mb-2 overflow-hidden bg-gray-200 rounded-md">
                    <span className="text-gray-500">Blank</span>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={tempDesign.name}
                    onChange={handleTempNameChange}
                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Done Button */}
            {tempDesign && (
              <div className="flex justify-end">
                <button
                  className="bg-[#7FAF37] text-white font-bold py-2 px-6 rounded-md text-sm uppercase border border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all duration-150"
                  onClick={handleDone}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
