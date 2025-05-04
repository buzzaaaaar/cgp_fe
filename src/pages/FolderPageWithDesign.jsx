import React, { useState, useRef, useEffect } from 'react';

export default function ProjectsPage() {
  const [folderVisible, setFolderVisible] = useState(true);
  const [folderName, setFolderName] = useState('Christmas');
  const [designs, setDesigns] = useState([
    { id: 1, name: 'Winter Tree', media: '/api/placeholder/400/320?text=Winter+Tree' },
    { id: 2, name: 'Gift Box', media: '' },
    { id: 3, name: 'Santa Hat', media: '' },
    { id: 4, name: 'Snowflake', media: '/api/placeholder/400/320?text=Snowflake' }
  ]);
  const [editingFolder, setEditingFolder] = useState(false);
  const [editingDesignId, setEditingDesignId] = useState(null);
  const [designMenuOpenId, setDesignMenuOpenId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState('');
  const designInputRef = useRef(null);
  const folderInputRef = useRef(null);

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

  const handleDeleteFolder = () => {
    setItemToDelete('folder');
    setDeleteItemType('folder');
    setShowPopup(true);
    setDesignMenuOpenId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteItemType === 'design') {
      setDesigns(designs.filter(design => design.id !== itemToDelete));
    } else if (deleteItemType === 'folder') {
      setFolderVisible(false);
    }
    setShowPopup(false);
  };

  const handleCancelDelete = () => {
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFolderRename = () => {
    setEditingFolder(false);
  };

  useEffect(() => {
    if (editingDesignId && designInputRef.current) {
      designInputRef.current.focus();
      designInputRef.current.select();
    }
  }, [editingDesignId]);

  useEffect(() => {
    if (editingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
      folderInputRef.current.select();
    }
  }, [editingFolder]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="h-16" />

      {folderVisible && (
        <>
          {/* Header */}
          <div className="w-full flex items-center justify-between px-8 mb-2">
            <div className="flex items-center gap-2">
              {editingFolder ? (
                <input
                  ref={folderInputRef}
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onBlur={handleFolderRename}
                  onKeyDown={(e) => e.key === 'Enter' && handleFolderRename()}
                  className="text-4xl font-bold text-[#7FAF37] focus:outline-none px-2 py-1 bg-transparent"
                />
              ) : (
                <h1 className="text-4xl font-bold text-[#7FAF37]">{folderName}</h1>
              )}
            </div>

            {/* Folder menu */}
            <div className="relative">
              <button
                className="text-gray-600 text-2xl hover:text-[#7FAF37]"
                onClick={() =>
                  setDesignMenuOpenId(designMenuOpenId === 'top' ? null : 'top')
                }
              >
                ⋮
              </button>
              {designMenuOpenId === 'top' && (
                <div className="absolute right-0 top-10 bg-white border rounded shadow-md z-50 w-32">
                  <button
                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                    onClick={() => setEditingFolder(true)}
                  >
                    Rename
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                    onClick={handleDeleteFolder}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[2px] bg-[#D4D4D4] mb-4" />

          <div className="flex flex-col px-8 py-8 flex-grow">
            <h2 className="text-xl font-bold text-[#7FAF37] mb-6">Designs</h2>

            <div className="flex flex-wrap gap-6">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="w-56 bg-white shadow-md rounded-lg relative border border-[#D4D4D4] pt-1"
                >
                  <div
                    className={`w-56 h-36 bg-gray-100 border-[3px] ${design.media ? 'border-gray-200' : 'border-white'
                      } rounded-lg mb-2 flex items-center justify-center overflow-hidden cursor-pointer`}
                  >
                    {design.media && (
                      <img
                        src={design.media}
                        alt="Design"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between px-2 pb-2">
                    {editingDesignId === design.id ? (
                      <input
                        ref={designInputRef}
                        type="text"
                        value={design.name}
                        onChange={(e) => handleDesignNameChange(design.id, e.target.value)}
                        onBlur={handleDesignBlur}
                        onKeyDown={(e) => handleDesignKeyDown(e, design.id)}
                        className="w-full px-2 py-1 bg-transparent focus:outline-none"
                      />
                    ) : (
                      <>
                        <div
                          className="text-[#013024] font-bold hover:underline hover:text-[#7FAF37] cursor-pointer truncate transition-all mr-4"
                          onClick={() => setEditingDesignId(design.id)}
                        >
                          {design.name}
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setDesignMenuOpenId(
                                designMenuOpenId === design.id ? null : design.id
                              )
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
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-black font-bold text-xl"
              onClick={handleClosePopup}
            >
              X
            </button>
            <div className="text-center text-lg mb-4 text-[#013024]">
              Are you sure you want to delete this {deleteItemType}?
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
    </div>
  );
}
