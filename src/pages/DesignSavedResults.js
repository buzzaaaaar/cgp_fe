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

function DesignSavedResultsPage() {
    const navigate = useNavigate();
    const [showCalendarPanel, setShowCalendarPanel] = useState(false);
    const [editEventData, setEditEventData] = useState({
        title: '',
        date: '',
        time: ''
    });
    const [savedEvent, setSavedEvent] = useState(null); // NEW: Store saved event data
    const [miniCalendarMonth, setMiniCalendarMonth] = useState(dayjs());
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
    const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Notes functionality
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const [accessLevel, setAccessLevel] = useState('Only you can access with this link');
    const [isThreeDotsDropdownOpen, setIsThreeDotsDropdownOpen] = useState(false);
    const threeDotsDropdownRef = useRef(null);

    // State for delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({
        show: false,
        type: '', // 'result' or 'media'
        id: null
    });

    // State for copy confirmation
    const [showCopyConfirm, setShowCopyConfirm] = useState({
        show: false,
        id: null
    });

    // State for image viewer
    const [imageViewer, setImageViewer] = useState({
        show: false,
        url: ''
    });

    // State for uploaded media files with both sample images
    const [mediaFiles, setMediaFiles] = useState([
        {
            id: 1,
            filename: "MeditationPose.jpg",
            url: "/Images/MeditationPose.jpg",
            uploadedAt: "2023-05-15T10:30:00Z"
        },
        {
            id: 2,
            filename: "Breakfast.jpg",
            url: "/Images/Breakfast.jpg",
            uploadedAt: "2023-05-16T08:45:00Z"
        }
    ]);

    const accessOptions = [
        'Only you can access with this link',
        'Anyone with the link can access (sign in required)'
    ];

    // Sample Cards Data
    const [cards, setCards] = useState([
        {
            id: 1,
            title: "SEO Meta Title",
            content: "Top 10 Healthy Morning Routines to Kickstart Your Day - Expert Tips & Habits"
        },
        {
            id: 2,
            title: "Instagram Hashtag Generator",
            content: "#MorningRoutine #HealthyHabits #WellnessJourney #SelfCareMorning #RiseAndShine #MindfulStart #MotivationDaily #HealthyLifestyle #RoutineGoals #WellnessTips"
        },
        {
            id: 3,
            title: "YouTube Content Ideas",
            content: "\"5 Life-Changing Morning Habits for a Productive Day\" \"My 30-Minute Healthy Morning Routine (No Gym Required)\" \"Morning Routines That Boost Mental Health and Energy Levels\""
        }
    ]);

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

    // Updated useEffect to handle saved events
    useEffect(() => {
        if (showCalendarPanel && !savedEvent) {
            clearPanelData();
        }
    }, [showCalendarPanel, clearPanelData, savedEvent]);

    // Updated openCalendarPanel to handle saved events
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

    // Updated handleSaveClick to store the event
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

    const toggleShareDropdown = () => {
        setIsShareDropdownOpen(!isShareDropdownOpen);
    };

    const handleAccessLevelChange = (level) => {
        setAccessLevel(level);
    };

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

    // Handle file upload
    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const newFiles = Array.from(files).map((file, index) => ({
                id: mediaFiles.length + index + 1,
                filename: file.name,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString()
            }));
            setMediaFiles([...mediaFiles, ...newFiles]);
        }
    };

    // Handle file delete
    const handleFileDelete = (id) => {
        setMediaFiles(mediaFiles.filter(file => file.id !== id));
    };

    // Show delete confirmation
    const showDeleteConfirmation = (type, id) => {
        setShowDeleteConfirm({
            show: true,
            type,
            id
        });
    };

    // Close delete confirmation
    const closeDeleteConfirmation = () => {
        setShowDeleteConfirm({
            show: false,
            type: '',
            id: null
        });
    };

    // Confirm delete action
    const confirmDelete = () => {
        if (showDeleteConfirm.type === 'result') {
            setCards(cards.filter(card => card.id !== showDeleteConfirm.id));
        } else if (showDeleteConfirm.type === 'media') {
            setMediaFiles(mediaFiles.filter(file => file.id !== showDeleteConfirm.id));
        }
        closeDeleteConfirmation();
    };

    // Copy content to clipboard
    const copyToClipboard = (content, id) => {
        navigator.clipboard.writeText(content);
        setShowCopyConfirm({
            show: true,
            id
        });
        setTimeout(() => setShowCopyConfirm(prev => ({ ...prev, show: false })), 2000);
    };

    // Open image viewer
    const openImageViewer = (url) => {
        setImageViewer({
            show: true,
            url
        });
    };

    // Close image viewer
    const closeImageViewer = () => {
        setImageViewer({
            show: false,
            url: ''
        });
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

    // Fixed Calendar Rendering
    const renderCalendarDays = () => {
        const monthStart = miniCalendarMonth.startOf('month');
        const daysInMonth = monthStart.daysInMonth();
        const startDay = monthStart.day(); // Day of week (0-6)
        
        const days = [];
        const rows = [];
        
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < startDay; i++) {
            days.push(<td key={`empty-${i}`} className="py-2"></td>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = monthStart.date(day);
            const formatted = currentDate.format('YYYY-MM-DD');
            const isToday = currentDate.isSame(dayjs(), 'day');
            const isSelected = editEventData.date === formatted;

            days.push(
                <td 
                    key={formatted}
                    className={`py-[6px] text-xs cursor-pointer text-center ${
                        isSelected ? 'bg-[#A7EC4F] text-white font-bold rounded-full' : 
                        isToday ? 'bg-green-200 rounded-full' : 'hover:bg-[#A7EC4F] hover:text-white'
                    }`}
                    onClick={() => handleDateChange(formatted)}
                >
                    {day}
                </td>
            );

            // Start a new row after 7 days
            if ((day + startDay) % 7 === 0 || day === daysInMonth) {
                rows.push(<tr key={`row-${rows.length}`}>{days.slice(-7)}</tr>);
            }
        }

        return rows;
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Main content with spacing after navbar */}
            <div className="flex flex-col flex-1 mt-[70px]">
                {/* Top Section - Dark Green #013024 - with increased height */}
                <div className="bg-[#013024] text-white px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Healthy Morning Routines</h1>
                    <div className="flex items-center space-x-4">
                        {/* Updated Calendar Button */}
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
                                            showCopyConfirm.show && showCopyConfirm.id === 'share'
                                                ? 'bg-white text-[#7FAF37] border-2 border-[#7FAF37]'
                                                : 'bg-[#7FAF37] text-white hover:bg-[#6c9631]'
                                        }`}
                                        onClick={() => {
                                            navigator.clipboard.writeText('https://your-link.com');
                                            setShowCopyConfirm({ show: true, id: 'share' });
                                            setTimeout(() => setShowCopyConfirm(prev => ({ ...prev, show: false })), 2000);
                                        }}
                                    >
                                        {showCopyConfirm.show && showCopyConfirm.id === 'share' ? 'Link copied!' : 'Copy link'}
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
                            {/* Cards */}
                            <div className="flex flex-col space-y-4">
                                {cards.map(card => (
                                    <div key={card.id} className="bg-white rounded-lg shadow-md p-4 relative">
                                        {showCopyConfirm.show && showCopyConfirm.id === card.id && (
                                            <div className="absolute top-2 right-2 bg-[#7FAF37] text-white px-2 py-1 rounded text-sm">
                                                Copied!
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="w-1/2 flex flex-col items-start">
                                                <h3 className="font-semibold text-lg text-[#013024]">{card.title}</h3>
                                                <div className="flex items-center space-x-4">
                                                    <button 
                                                        className="flex items-center text-green-600 hover:text-green-800"
                                                        onClick={() => copyToClipboard(card.content, card.id)}
                                                    >
                                                        <img src="/Images/CopyIcon.png" alt="Copy" className="w-5 h-5 mr-1" />
                                                        Copy
                                                    </button>
                                                    <button 
                                                        className="flex items-center text-red-600 hover:text-red-800"
                                                        onClick={() => showDeleteConfirmation('result', card.id)}
                                                    >
                                                        <img src="/Images/DeleteIcon.png" alt="Delete" className="w-5 h-5 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-1/2 text-left">
                                                <p className="text-gray-700 font-semibold" style={{ fontWeight: 600, color: '#000000' }}>{card.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upload Media */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-[#8CB735] mb-4">UPLOAD MEDIA</h2>
                            <div className="bg-[#A7EC4F] rounded-lg p-16 flex flex-col items-center justify-center w-full h-[400px]">
                                <p className="text-gray-700 mb-2 font-semibold" style={{ color: '#000000', fontWeight: '600' }}>Drag and drop files here</p>
                                <span className="text-gray-500 mb-6">or</span>
                                <label className="bg-[#8CB735] text-white px-8 py-2 rounded-md hover:bg-opacity-90 font-medium cursor-pointer">
                                    Select Files
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        multiple 
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Uploaded Media Files */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-[#8CB735] mb-4">UPLOADED MEDIA FILES</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {mediaFiles.map(file => (
                                    <div key={file.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img 
                                                src={file.url} 
                                                alt={file.filename} 
                                                className="w-16 h-16 object-cover rounded mr-4"
                                            />
                                            <div>
                                                <p className="font-medium">{file.filename}</p>
                                                <p className="text-gray-500 text-sm">
                                                    Uploaded: {formatNoteTimestamp(file.uploadedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button 
                                                className="flex items-center text-green-600 hover:text-green-800"
                                                onClick={() => openImageViewer(file.url)}
                                            >
                                                <img src="/Images/ViewIcon.png" alt="View" className="w-5 h-5 mr-1" />
                                                View
                                            </button>
                                            <button 
                                                className="flex items-center text-red-600 hover:text-red-800"
                                                onClick={() => showDeleteConfirmation('media', file.id)}
                                            >
                                                <img src="/Images/DeleteIcon.png" alt="Delete" className="w-5 h-5 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                <div className="fixed top-0 right-0 w-[380px] h-full bg-white border-l border-[#D4D4D4] z-50 shadow-lg p-5 overflow-y-auto">
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

                    {/* Fixed Date Picker */}
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
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <th key={day} className="py-1 text-xs font-semibold text-[#7FAF37]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {renderCalendarDays()}
                            </tbody>
                        </table>
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

            {/* Delete Confirmation Popup */}
            {showDeleteConfirm.show && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-96">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={closeDeleteConfirmation}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="mb-8 text-center">
                        <p className="text-gray-700 font-bold" style={{ fontWeight: 700 }}>
                            {showDeleteConfirm.type === 'result' 
                                ? "Are you sure you want to delete this generated result?"
                                : "Are you sure you want to delete this media?"}
                        </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="px-6 py-2 rounded font-semibold bg-[#7FAF37] text-white hover:bg-white hover:text-[#7FAF37] hover:border hover:border-[#7FAF37] transition-colors"
                            onClick={confirmDelete}
                        >
                            YES
                        </button>
                        <button
                            className="px-6 py-2 rounded font-semibold bg-[#7FAF37] text-white hover:bg-white hover:text-[#7FAF37] hover:border hover:border-[#7FAF37] transition-colors"
                            onClick={closeDeleteConfirmation}
                        >
                            NO
                        </button>
                    </div>
                </div>
            )}

            {/* Image Viewer Modal */}
            {imageViewer.show && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="relative" style={{ width: '80vw', height: '80vh' }}>
                        <button 
                            onClick={closeImageViewer}
                            className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
                        >
                            ✕
                        </button>
                        <img 
                            src={imageViewer.url} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default DesignSavedResultsPage;