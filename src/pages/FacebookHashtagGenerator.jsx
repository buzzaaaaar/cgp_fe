import React, { useState, useRef } from 'react';

// Correcting the image imports
import FBcontent from '../assets/FBContent.png';
import FBcaption from '../assets/FBCaption.png';
import SaveSuccessfulIcon from '../assets/savesuccessful.png';

export default function FacebookHashtagGenerators() {
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
    <div className="min-h-screen bg-white font-hanken px-4 sm:px-8 py-6">
      <div className="h-16"></div>

      <div className="mb-6">
        <h1 className="text-5xl font-extrabold text-[#7FAF37] mb-4">Facebook Hashtag Generator</h1>
        <hr className="border-t border-gray-300" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 w-full">
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-4xl px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none"
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
              className="w-full max-w-4xl p-4 border border-gray-300 rounded-md text-base resize-none focus:outline-none"
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

        <div className="lg:w-1/3 w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#7FAF37] text-center mb-6">Related Tools</h2>

           {/*Facebook Caption Generator*/}
           <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white min-h-[150px] shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-2">
              <img src={FBcaption} alt="Blog Post Ideas" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">Facebook Caption Generator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
            Create catchy Facebook captions that spark interest and increase post engagement
            </p>
            <div className="text-sm text-[#013024] text-right cursor-pointer hover:underline hover:text-[#7FAF37]">Learn more</div>
          </div>

           {/* Facebook Content Ideas*/}
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white min-h-[150px] shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-2">
              <img src={FBcontent} alt="Topical Map Generator" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">Facebook Content Ideas</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
            Get unique and attention-grabbing content ideas to keep your Facebook followers engaged
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl relative flex flex-col">
            {/* Close button above the horizontal line */}
            <button
              className="absolute top-2 right-2 text-black font-bold text-2xl"
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-lg w-[1000px] min-h-[600px] shadow-xl relative flex flex-col">
            {/* Title */}
            <div className="flex justify-between items-center mb-4 border-b border-[#D4D4D4] pb-4">
              <h3 className="text-2xl font-semibold text-[#013024]">Save to</h3>
              <button className="text-black font-bold text-2xl" onClick={handleClosePopup}>
                ×
              </button>
            </div>

            {/* Subheading */}
            <h3 className="text-xl font-semibold text-[#7FAF37] mb-4">Designs</h3>

            {/* Content */}
            <div className="flex-grow flex items-start gap-4 overflow-x-auto mb-6">
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
                  <div className="w-48 h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    {design.media ? (
                      <img src={design.media} alt="Design" className="w-full h-full object-cover" />
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
                  <div className="w-48 h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500">Blank</span>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={tempDesign.name}
                    onChange={handleTempNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none"
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
    </div>
  );
}
