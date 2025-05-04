import React, { useState, useRef, useEffect } from 'react';

export default function ProjectsPage() {
  const [designs, setDesigns] = useState([]);
  const [editingDesignId, setEditingDesignId] = useState(null);
  const [designMenuOpenId, setDesignMenuOpenId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState('');

  const designInputRef = useRef(null);

  const handleCreateDesign = () => {
    const newDesign = {
      id: Date.now(),
      name: "Untitled design",
      media: null
    };
    setDesigns([...designs, newDesign]);
    setEditingDesignId(newDesign.id);
  };

  const handleUploadMedia = (designId) => {
    const placeholderImageUrl = "/api/placeholder/400/320";
    setDesigns(designs.map(design =>
      design.id === designId ? { ...design, media: placeholderImageUrl } : design
    ));
  };

  const handleDesignNameChange = (id, newName) => {
    setDesigns(designs.map(design =>
      design.id === id ? { ...design, name: newName } : design
    ));
  };

  const handleDesignBlur = () => {
    setEditingDesignId(null);
  };

  const handleDesignKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      setEditingDesignId(null);
    }
  };

  const handleRenameDesign = (id) => {
    setEditingDesignId(id);
    setDesignMenuOpenId(null);
  };

  const handleDeleteDesign = (id) => {
    setItemToDelete(id);
    setDeleteItemType('design');
    setShowPopup(true);
    setDesignMenuOpenId(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && deleteItemType === 'design') {
      setDesigns(designs.filter(design => design.id !== itemToDelete));
    }
    setShowPopup(false);
  };

  const handleCancelDelete = () => {
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (editingDesignId && designInputRef.current) {
      designInputRef.current.focus();
      designInputRef.current.select();
    }
  }, [editingDesignId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-16 bg-white border-b border-gray-200" />

      <div className="flex flex-col px-8 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#7FAF37]">Untitled folder</h1>
          <hr className="border-t border-[#D4D4D4] mt-4" />
        </div>

        {/* Designs */}
        <div className="w-full pl-4">
          <h2 className="text-xl font-bold text-[#7FAF37] mb-4">Designs</h2>
          <div className="flex items-start">
            <button
              className="bg-[#7FAF37] text-white font-medium py-3 px-6 rounded-md w-72 flex items-center justify-center border-2 border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all"
              onClick={handleCreateDesign}
            >
              <span className="mr-2">+</span> CREATE NEW
            </button>

            <div className="flex flex-wrap gap-6 ml-8">
              {designs.map((design) => (
                <div key={design.id} className="w-56 shadow-md rounded-lg relative">
                  <div
                    className={`w-56 h-36 bg-gray-100 border-[3px] ${design.media ? 'border-gray-200' : 'border-white'
                      } rounded-lg mb-2 flex items-center justify-center overflow-hidden cursor-pointer`}
                    onClick={() => handleUploadMedia(design.id)}
                  >
                    {design.media && (
                      <img src={design.media} alt="Design" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex items-center justify-center px-2">
                    {editingDesignId === design.id ? (
                      <input
                        ref={designInputRef}
                        type="text"
                        value={design.name}
                        onChange={(e) => handleDesignNameChange(design.id, e.target.value)}
                        onBlur={handleDesignBlur}
                        onKeyDown={(e) => handleDesignKeyDown(e, design.id)}
                        className="w-full px-2 py-1 border border-[#7FAF37] rounded focus:outline-none"
                      />
                    ) : (
                      <>
                        <div
                          className="text-[#013024] font-bold hover:underline hover:text-[#7FAF37] cursor-pointer truncate transition-all"
                          onClick={() => setEditingDesignId(design.id)}
                        >
                          {design.name}
                        </div>
                        <div className="relative ml-3">
                          <button
                            onClick={() =>
                              setDesignMenuOpenId(designMenuOpenId === design.id ? null : design.id)
                            }
                            className="text-gray-500 font-bold"
                          >
                            ⋮
                          </button>
                          {designMenuOpenId === design.id && (
                            <div className="absolute right-0 top-6 bg-white border rounded shadow-md z-10">
                              <button
                                className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                                onClick={() => handleRenameDesign(design.id)}
                              >
                                Rename
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                                onClick={() => handleDeleteDesign(design.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-black font-bold text-xl hover:text-[#7FAF37] transition-all"
              onClick={handleClosePopup}
            >
              X
            </button>
            <div className="text-center text-lg mb-4 text-[#013024]">
              Are you sure you want to delete this design?
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#7FAF37] text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#7FAF37] hover:border-[#7FAF37] transition-all border border-[#7FAF37]"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-[#7FAF37] text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#7FAF37] hover:border-[#7FAF37] transition-all border border-[#7FAF37]"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-16 bg-white border-t border-gray-200" />
    </div>
  );
}
