import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isToday from 'dayjs/plugin/isToday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

dayjs.extend(weekday);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

function formatNoteTimestamp(isoString) {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function DesignPage() {
    const navigate = useNavigate();
    const [showCalendarPanel, setShowCalendarPanel] = useState(false);
    const [editEventData, setEditEventData] = useState({
        title: '',
        date: '',
        time: ''
    });
    const [savedEvent, setSavedEvent] = useState(null);
    const [miniCalendarMonth, setMiniCalendarMonth] = useState(dayjs());
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
    const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
    const [accessLevel, setAccessLevel] = useState('Only you can access with this link');
    const dropdownRef = useRef(null);

    // Notes functionality
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    // File upload functionality
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const accessOptions = [
        'Only you can access with this link',
        'Anyone with the link can access (sign in required)'
    ];

    // Image
    const initialImage = "/Images/MeditationPose.jpg";

    // Clear Data on Panel Open
    const clearPanelData = useCallback(() => {
        setEditEventData({
            title: '',
            date: '',
            time: ''
        });
        setMiniCalendarMonth(dayjs());
        setValidationErrors({});
    }, []);

    useEffect(() => {
        if (showCalendarPanel && !savedEvent) {
            clearPanelData();
        }
    }, [showCalendarPanel, clearPanelData, savedEvent]);

    const openCalendarPanel = () => {
        setShowCalendarPanel(true);
        if (savedEvent) {
            setEditEventData(savedEvent);
            setMiniCalendarMonth(dayjs(savedEvent.date));
        }
    };

    const closeCalendarPanel = () => {
        setShowCalendarPanel(false);
    };

    const handleDateChange = (date) => {
        setEditEventData(prev => ({ ...prev, date: date }));
        setValidationErrors(prev => ({ ...prev, date: undefined }));
    };

    const handleTimeChange = (e) => {
        setEditEventData(prev => ({ ...prev, time: e.target.value }));
        setValidationErrors(prev => ({ ...prev, time: undefined }));
    };

    const goToSEOTools = () => {
        navigate('/seo-tools');
    };

    const handleSaveClick = () => {
        const errors = {};
        if (!editEventData.title) errors.title = 'Please enter the title.';
        if (!editEventData.date) errors.date = 'Please select a date.';
        if (!editEventData.time) errors.time = 'Please select a time.';

        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            setSavedEvent(editEventData);
            setShowSavePopup(true);
            setShowCalendarPanel(false);
            setIsAddedToCalendar(true);
        }
    };

    const closeSavePopup = () => {
        setShowSavePopup(false);
    };

    // Add new note with current timestamp
    const handleAddNote = () => {
        if (newNote.trim()) {
            const newNoteObj = {
                id: Date.now(),
                content: newNote,
                timestamp: new Date().toISOString(),
                author: "You"
            };
            setNotes([...notes, newNoteObj]);
            setNewNote("");
        }
    };

    // File handling functions
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    const renderCalendar = () => {
        const monthStart = miniCalendarMonth.startOf('month');
        const daysInMonth = monthStart.daysInMonth();
        const firstDay = monthStart.day();
        const today = dayjs();
        let day = 1;
        let calendar = [];

        for (let i = 0; i < 6; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<td key={`${i}-${j}`} className="border px-2 py-1"></td>);
                } else if (day <= daysInMonth) {
                    const currentDate = dayjs(`${monthStart.year()}-${monthStart.month() + 1}-${day}`);
                    const isToday = currentDate.isSame(today, 'day');
                    week.push(
                        <td
                            key={`${i}-${j}`}
                            className={`border px-2 py-1 cursor-pointer ${editEventData.date === currentDate.format('YYYY-MM-DD') ? 'bg-[#A7EC4F]' : (isToday ? 'bg-green-200' : '')}`}
                            onClick={() => {
                                handleDateChange(currentDate.format('YYYY-MM-DD'));
                            }}
                        >
                            {day++}
                        </td>
                    );
                } else {
                    week.push(<td key={`${i}-${j}`} className="border px-2 py-1"></td>);
                }
            }
            calendar.push(<tr key={i}>{week}</tr>);
        }

        return calendar;
    };

    const toggleShareDropdown = () => {
        setIsShareDropdownOpen(!isShareDropdownOpen);
    };

    const handleAccessLevelChange = (level) => {
        setAccessLevel(level);
    };

    const handleCopyLink = () => {
        alert('Link Copied!'); 
        setIsShareDropdownOpen(false);
    };
    const [showCopyConfirm, setShowCopyConfirm] = useState(false);

    const [isThreeDotsDropdownOpen, setIsThreeDotsDropdownOpen] = useState(false);
    const threeDotsDropdownRef = useRef(null);

    const toggleThreeDotsDropdown = () => {
        setIsThreeDotsDropdownOpen(!isThreeDotsDropdownOpen);
    };

    const handleRename = () => {
        alert('Rename clicked');
        setIsThreeDotsDropdownOpen(false);
    };

    const handleDelete = () => {
        alert('Delete clicked');
        setIsThreeDotsDropdownOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (threeDotsDropdownRef.current && !threeDotsDropdownRef.current.contains(event.target)) {
                setIsThreeDotsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [threeDotsDropdownRef]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShareDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Main content with spacing after navbar */}
            <div className="flex flex-col flex-1 mt-[70px]">
                {/* Top Section - Dark Green #013024 - with increased height */}
                <div className="bg-[#013024] text-white px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Untitled Design</h1>
                    <div className="flex items-center space-x-4">
                        {isAddedToCalendar ? (
                            <button
                                className="bg-[#013024] text-white px-4 py-2 rounded-md flex items-center border border-white"
                                onClick={openCalendarPanel}
                            >
                                <img src="/Images/AddedIcon.png" alt="Added" className="w-5 h-5 mr-2" />
                                Added to Calendar
                            </button>
                        ) : (
                            <button
                                className="bg-white text-[#013024] px-4 py-2 rounded-md flex items-center"
                                onClick={openCalendarPanel}
                            >
                                <img src="/Images/AddIcon.png" alt="Add" className="w-5 h-5 mr-2" />
                                Add to Calendar
                            </button>
                        )}
                        <div className="relative">
                            <button
                                className="border border-white text-white px-4 py-2 rounded-md flex items-center"
                                onClick={toggleShareDropdown}
                            >
                                <img src="/Images/ShareIcon.png" alt="Share" className="w-5 h-5 mr-2" />
                                Share
                            </button>
                            {isShareDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-[450px] bg-white rounded-md shadow-lg z-10 p-6"
                                >
                                    <h3 className="text-lg font-medium text-gray-700">Share this design</h3>
                                    <div className="border-t border-gray-200 mt-3 pt-3">
                                        <h4 className="flex items-center text-sm font-semibold uppercase tracking-wide">
                                            <img
                                                src="/Images/AccessLevelIcon.png"
                                                alt="Access Level"
                                                className="w-4 h-4 mr-1"
                                            />
                                            <span style={{ color: '#7FAF37' }}>Access level</span>
                                        </h4>
                                        <div className="relative inline-block w-full text-gray-700 mt-2">
                                            <select
                                                className="w-full h-11 pl-3 pr-6 text-base placeholder-gray-600 border rounded-md appearance-none focus:shadow-outline"
                                                style={{ borderColor: '#7FAF37', color: 'black', paddingRight: '2rem' }}
                                                value={accessLevel}
                                                onChange={(e) => handleAccessLevelChange(e.target.value)}
                                            >
                                                {accessOptions.map((option) => (
                                                    <option key={option} value={option} style={{ color: 'black' }}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 fill-current"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`w-full px-4 py-2 rounded-md mt-3 font-semibold transition-colors duration-300 ${
                                            showCopyConfirm
                                                ? 'bg-white text-[#7FAF37] border-2 border-[#7FAF37]'
                                                : 'bg-[#7FAF37] text-white hover:bg-[#6c9631]'
                                        }`}
                                        onClick={() => {
                                            navigator.clipboard.writeText('https://your-link.com');
                                            setShowCopyConfirm(true);
                                            setTimeout(() => setShowCopyConfirm(false), 2000);
                                        }}
                                    >
                                        {showCopyConfirm ? 'Link copied!' : 'Copy link'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={toggleThreeDotsDropdown}
                                className="text-white p-2"
                                style={{ fontWeight: '900' }}
                            >
                                <div className="flex flex-col items-center justify-center space-y-1">
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                </div>
                            </button>

                            {isThreeDotsDropdownOpen && (
                                <div
                                    ref={threeDotsDropdownRef}
                                    className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
                                >
                                    <button
                                        onClick={handleRename}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        style={{ fontWeight: '700' }}
                                    >
                                        Rename
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        style={{ fontWeight: '700' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Main Content Area with Notes Sidebar */}
                <div className="flex flex-1">
                    {/* Left: Main Content */}
                    <div className="flex-1 px-8 py-6">
                        {/* Saved Generated Results */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-[#8CB735] mb-4">SAVED GENERATED RESULTS</h2>
                            <button
                                className="bg-[#013024] text-white px-8 py-2 rounded-md font-semibold hover:bg-white hover:text-black hover:border-[#013024] transition duration-300 border border-transparent w-[200px]"
                                onClick={goToSEOTools}
                            >
                                Get Started
                            </button>
                        </div>
                        {/* Upload Media */}
                        <div>
                            <h2 className="text-xl font-bold text-[#8CB735] mb-4">UPLOAD MEDIA</h2>
                            
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                style={{ display: 'none' }}
                            />
                            
                            <div 
                                className={`rounded-lg p-16 flex flex-col items-center justify-center w-full h-[400px] transition-colors ${
                                    isDragging ? 'bg-[#8CB735]' : 'bg-[#A7EC4F]'
                                }`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <p className="text-gray-700 mb-2 font-semibold" style={{ color: '#000000', fontWeight: '600' }}>
                                    {isDragging ? 'Drop files here' : 'Drag and drop files here'}
                                </p>
                                <span className="text-gray-500 mb-6">or</span>
                                <button 
                                    className="bg-[#8CB735] text-white px-8 py-2 rounded-md hover:bg-opacity-90 font-medium"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Select Files
                                </button>
                            </div>
                            
                            {/* File preview section */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="border p-2 rounded">
                                                <div className="flex items-center">
                                                    {file.type.startsWith('image/') ? (
                                                        <img 
                                                            src={URL.createObjectURL(file)} 
                                                            alt={file.name} 
                                                            className="w-16 h-16 object-cover mr-2"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mr-2">
                                                            <span className="text-xs">{file.name.split('.').pop()}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right: Notes */}
                    <div className="w-[350px] bg-[#8CB735] flex flex-col h-full min-h-[calc(100vh-150px)]">
                        <div className="p-4 border-b border-white">
                            <h2 className="text-xl font-bold text-white">Notes</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {notes.map((note) => (
                                <div key={note.id} className="mb-4">
                                    <div className="flex items-start mb-1">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8CB735] font-bold mr-2 flex-shrink-0">
                                            {note.author.charAt(0)}
                                        </div>
                                        <div className="bg-white rounded-lg p-3 flex-1">
                                            <p className="text-gray-800">{note.content}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-white ml-10 pl-1">
                                        {formatNoteTimestamp(note.timestamp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 flex items-center">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Add a note"
                                    className="w-full px-3 py-2 pr-10 rounded border border-green-400 focus:outline-none"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <button 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
                                    onClick={handleAddNote}
                                >
                                    <img src="/Images/AddNoteIcon.png" alt="Add Note" className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Panel */}
            {showCalendarPanel && (
                <div
                    className="fixed top-0 right-0 w-[380px] h-full bg-white border-l border-[#D4D4D4] z-50 shadow-lg p-5 overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-xl font-bold text-[#013024]">Add to Calendar</div>
                        <button
                            className="text-gray-500 hover:text-black text-xl"
                            onClick={closeCalendarPanel}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="border-b border-[#D4D4D4] mb-4"></div>
                    {/* Calendar Image */}
                    <div className="bg-[#D4D4D4] p-1 shadow-[0_2px_6px_#D4D4D4] mb-4">
                        <img src={initialImage} alt="Meditation Pose" className="w-full h-40 object-cover rounded" />
                        <p className="text-center font-semibold mt-2">Health Care Routines</p>
                    </div>

                    {/* Calendar Panel Content */}
                    <div className="mb-4">
                        <label className="text-[#7FAF37] font-semibold flex items-center gap-2 mb-1">
                            <img src="/Images/ReminderTitleIcon.png" className="w-4 h-4" alt="Title" />
                            Title
                        </label>
                        <input
                            type="text"
                            className="w-full border px-2 py-1 rounded"
                            placeholder="Enter title"
                            value={editEventData.title}
                            onChange={(e) => {
                                setEditEventData(prev => ({ ...prev, title: e.target.value }));
                                setValidationErrors(prev => ({ ...prev, title: undefined }));
                            }}
                        />
                        {validationErrors.title && (
                            <p className="text-red-500 text-sm">{validationErrors.title}</p>
                        )}
                    </div>

                    {/* Date Picker */}
                    <div className="mb-4">
                        <label className="text-[#7FAF37] font-semibold flex items-center gap-2 mb-2">
                            <img src="/Images/DateIcon.png" className="w-4 h-4" alt="Date" /> Date
                        </label>
                        <div className="flex justify-between items-center mb-2 px-2">
                            <button
                                onClick={() => setMiniCalendarMonth(prev => prev.subtract(1, 'month'))}
                                className="text-[#7FAF37] font-bold text-lg hover:text-[#013024]"
                            >
                                ‹
                            </button>
                            <div className="text-sm font-semibold text-[#013024]">
                                {miniCalendarMonth.format('MMMM YYYY')}
                            </div>
                            <button
                                onClick={() => setMiniCalendarMonth(prev => prev.add(1, 'month'))}
                                className="text-[#7FAF37] font-bold text-lg hover:text-[#013024]"
                            >
                                ›
                            </button>
                        </div>
                        {validationErrors.date && (
                            <p className="text-red-500 text-sm">{validationErrors.date}</p>
                        )}
                        <div className="grid grid-cols-7 text-center text-xs border rounded shadow-lg">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="py-1 font-semibold text-[#7FAF37]">{d}</div>
                            ))}
                            {(() => {
                                const monthStart = miniCalendarMonth.startOf('month');
                                const daysInMonth = monthStart.daysInMonth();
                                const firstDay = monthStart.day();

                                const cells = [];

                                for (let i = 0; i < 42; i++) {
                                    const day = i - firstDay;
                                    if (day >= 0 && day < daysInMonth) {
                                        const currentDate = monthStart.date(day + 1);
                                        const formatted = currentDate.format('YYYY-MM-DD');
                                        const isSelected = editEventData.date === formatted;
                                        cells.push(
                                            <div
                                                key={formatted}
                                                className={`py-[6px] text-xs cursor-pointer rounded-full ${isSelected ? 'bg-[#A7EC4F] text-white font-bold' : 'hover:bg-[#A7EC4F] hover:text-white'}`}
                                                onClick={() => handleDateChange(formatted)}
                                            >
                                                {day + 1}
                                            </div>
                                        );
                                    } else {
                                        cells.push(<div key={`empty-${i}`} className="py-2" />);
                                    }
                                }
                                return cells;
                            })()}
                        </div>
                    </div>

                    {/* Time Select */}
                    <div className="mb-6">
                        <label className="text-[#7FAF37] font-semibold flex items-center gap-2 mb-1">
                            <img src="/Images/TimeIcon.png" className="w-4 h-4" alt="Time" />
                            Time
                        </label>
                        <select
                            className="w-full border px-2 py-1 rounded"
                            value={editEventData.time}
                            onChange={handleTimeChange}
                        >
                            <option value="">Select Time</option>
                            {[
                                '8:00am', '8:30am', '9:00am', '9:30am',
                                '10:00am', '10:30am', '11:00am', '11:30am',
                                '12:00pm', '12:30pm', '1:00pm', '1:30pm',
                                '2:00pm', '2:30pm', '3:00pm', '3:30pm',
                                '4:00pm', '4:30pm', '5:00pm', '5:30pm',
                                '6:00pm', '6:30pm', '7:00pm', '7:30pm',
                                '8:00pm', '8:30pm', '9:00pm'
                            ].map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                        {validationErrors.time && (
                            <p className="text-red-500 text-sm">{validationErrors.time}</p>
                        )}
                    </div>

                    <div className="flex justify-start gap-4">
                        <button
                            className="bg-[#7FAF37] text-white px-5 py-2 rounded font-semibold hover:bg-transparent hover:text-[#7FAF37] border border-[#7FAF37] transition"
                            onClick={handleSaveClick}
                        >
                            SAVE
                        </button>
                        <button
                            className="bg-[#7FAF37] text-white px-5 py-2 rounded font-semibold hover:bg-transparent hover:text-[#7FAF37] border border-[#7FAF37] transition"
                            onClick={closeCalendarPanel}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}
            {/* Save Successful Popup */}
            {showSavePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded shadow-lg z-50 w-96 drop-shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-[#013024] flex items-center" style={{ fontWeight: 700 }}>
                            <img src="/Images/SaveSuccessfulIcon.png" alt="Save Successful" className="w-8 h-8 mr-2" />
                            Save Successful
                        </div>
                        <button onClick={closeSavePopup} className="text-gray-500 hover:text-gray-700" style={{ marginTop: '-20px', fontSize: '1.5em' }}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default DesignPage;