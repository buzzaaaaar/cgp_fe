import React, { useState, useRef, useEffect } from 'react';

const FolderPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [hoveredDesignId, setHoveredDesignId] = useState(null);
  const newInputRef = useRef(null);

  // Button styles for hover effect
  const buttonStyles = {
    backgroundColor: isHovered ? 'white' : '#7FAF37',
    color: isHovered ? '#7FAF37' : 'white',
    border: isHovered ? '2px solid #7FAF37' : '2px solid transparent',
    transition: 'all 0.3s ease'
  };

  // Create a new design
  const handleCreateNew = () => {
    const newDesign = {
      id: Date.now(),
      name: "Untitled design",
      isEditing: true,
      media: null // No media uploaded initially
    };
    setDesigns([...designs, newDesign]);
  };

  // Handle name change
  const handleNameChange = (id, newName) => {
    setDesigns(designs.map(design => 
      design.id === id ? { ...design, name: newName } : design
    ));
  };

  // Handle when editing is complete
  const handleEditComplete = (id, event) => {
    // Save on Enter key or blur
    if (!event || event.key === 'Enter') {
      setDesigns(designs.map(design => 
        design.id === id ? { ...design, isEditing: false } : design
      ));
    }
  };

  // Simulate media upload for a design
  const handleMediaUpload = (id, e) => {
    // In a real app, you would handle file upload here
    // For this example, we'll just simulate by setting a URL
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the uploaded file
      const mediaUrl = URL.createObjectURL(file);
      setDesigns(designs.map(design => 
        design.id === id ? { ...design, media: mediaUrl } : design
      ));
    }
  };

  // Focus on the new input when a new design is created
  useEffect(() => {
    if (designs.length > 0 && designs[designs.length - 1].isEditing && newInputRef.current) {
      newInputRef.current.focus();
      newInputRef.current.select();
    }
  }, [designs]);

  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
      {/* Space for external header */}
      <div className="h-16">
        {/* This space will be occupied by your external header component */}
      </div>

      {/* Page content */}
      <div className="flex flex-col flex-grow bg-white">
        {/* Folder header */}
        <header className="flex justify-between items-center px-4 py-2 border-b">
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#7FAF37', 
            fontFamily: 'Hanken Grotesk, sans-serif' 
          }}>
            Untitled folder
          </h1>
          <button className="p-1 rounded-full hover:bg-gray-100">
            {/* More vertical icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="p-6 flex-grow">
          <div className="mb-2">
            <h2 style={{ 
              fontSize: '18px', 
              color: '#7FAF37', 
              fontFamily: 'Hanken Grotesk, sans-serif' 
            }}>
              Designs
            </h2>
          </div>
          
          <div className="flex flex-wrap items-start">
            {/* Create New Button with hover effect */}
            <button 
              className="flex justify-center items-center w-full md:w-64 font-medium py-3 px-4 rounded"
              style={buttonStyles}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleCreateNew}
            >
              {/* Plus icon - color changes with hover state */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={isHovered ? '#7FAF37' : 'currentColor'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-1"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              CREATE NEW
            </button>
            
            {/* Design Items */}
            {designs.map((design, index) => (
              <div 
                key={design.id} 
                className="ml-4 mt-4 md:mt-0 border rounded-md w-64 overflow-hidden flex flex-col"
              >
                {/* Design preview area */}
                <div 
                  className="relative h-40 w-full cursor-pointer"
                  onClick={() => {
                    const fileInput = document.getElementById(`file-upload-${design.id}`);
                    if (fileInput) fileInput.click();
                  }}
                >
                  {design.media ? (
                    <img 
                      src={design.media} 
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                  
                  <input 
                    id={`file-upload-${design.id}`}
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(design.id, e)}
                  />
                </div>
                
                {/* Design name with menu button */}
                <div className="p-3">
                  {design.isEditing ? (
                    <input
                      ref={index === designs.length - 1 ? newInputRef : null}
                      type="text"
                      value={design.name}
                      onChange={(e) => handleNameChange(design.id, e.target.value)}
                      onKeyDown={(e) => handleEditComplete(design.id, e)}
                      onBlur={() => handleEditComplete(design.id)}
                      className="font-medium w-full outline-none border-b border-gray-300 focus:border-green-500 pb-1"
                      style={{ color: '#013024' }}
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <div 
                        className="font-medium cursor-pointer truncate mr-2"
                        style={{ 
                          color: hoveredDesignId === design.id ? '#7FAF37' : '#013024',
                          textDecoration: hoveredDesignId === design.id ? 'underline' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={() => setHoveredDesignId(design.id)}
                        onMouseLeave={() => setHoveredDesignId(null)}
                        onClick={() => {
                          setDesigns(designs.map(d => 
                            d.id === design.id ? { ...d, isEditing: true } : d
                          ));
                        }}
                      >
                        {design.name}
                      </div>

                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#013024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty Folder State */}
          {designs.length === 0 && (
            <div className="flex-1 flex justify-center items-center mt-16">
              {/* This area would show items when they exist */}
            </div>
          )}
        </div>
      </div>

      {/* Space for external footer */}
      <div className="h-16">
        {/* This space will be occupied by your external footer component */}
      </div>
    </div>
  );
};

export default FolderPage;
