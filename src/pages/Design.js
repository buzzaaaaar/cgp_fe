import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function DesignPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Main content with spacing after navbar */}
            <div className="flex flex-1 mt-[70px]">
                {/* Left: Main Content - Scrollable */}
                <div className="flex-1 px-8 py-6 overflow-y-auto">
                    {/* Saved Generated Results */}
                    <div className="mb-8 border-b pb-6">
                        <h2 className="text-xl font-bold text-[#8CB735] mb-4">SAVED GENERATED RESULTS</h2>
                        <button className="bg-[#013024] text-white px-8 py-2 rounded-md font-semibold hover:bg-opacity-90 w-[200px]">
                            Get Started
                        </button>
                    </div>

                    {/* Upload Media */}
                    <div>
                        <h2 className="text-xl font-bold text-[#8CB735] mb-4">UPLOAD MEDIA</h2>
                        <div className="bg-[#A7EC4F] rounded-lg p-16 flex flex-col items-center justify-center w-full h-[400px]">
                            <p className="text-gray-700 mb-2 font-semibold" style={{ color: '#000000', fontWeight: '600' }}>Drag and drop files here</p>
                            <span className="text-gray-500 mb-6">or</span>
                            <button className="bg-[#8CB735] text-white px-8 py-2 rounded-md hover:bg-opacity-90 font-medium">
                                Select Files
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Notes - Fixed */}
                <div className="w-[350px] bg-[#8CB735] flex flex-col h-full min-h-[calc(100vh-70px)]">
                    <div className="p-4 border-b border-white">
                        <h2 className="text-xl font-bold text-white">Notes</h2>
                    </div>
                    <div className="flex-1 p-4">
                        {/* Notes content goes here */}
                    </div>
                    <div className="p-4 flex items-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Add a note"
                                className="w-full px-3 py-2 pr-10 rounded border border-green-400 focus:outline-none"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600">
                                <img src="/Images/AddNoteIcon.png" alt="Add Note" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default DesignPage;
