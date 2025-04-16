import React, { useState, useEffect, useCallback } from 'react';
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

function DesignSavedResultsPage() {
    const navigate = useNavigate();
    const [showCalendarPanel, setShowCalendarPanel] = useState(false);
    const [editEventData, setEditEventData] = useState({
        title: '',
        date: '',
        time: ''
    });
    const [miniCalendarMonth, setMiniCalendarMonth] = useState(dayjs());

    // Image
    const initialImage = "/Images/MeditationPose.jpg";

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

    // Clear Data on Panel Open
    const clearPanelData = useCallback(() => {
        setEditEventData({
            title: '',
            date: '',
            time: ''
        });
        setMiniCalendarMonth(dayjs());
    }, []);

    useEffect(() => {
        if (showCalendarPanel) {
            clearPanelData();
        }
    }, [showCalendarPanel, clearPanelData]);

    const openCalendarPanel = () => {
        setShowCalendarPanel(true);
    };

    const closeCalendarPanel = () => {
        setShowCalendarPanel(false);
    };

    const handleDateChange = (date) => {
        setEditEventData(prev => ({ ...prev, date: date }));
    };

    const handleTimeChange = (e) => {
        setEditEventData(prev => ({ ...prev, time: e.target.value }));
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

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Main content with spacing after navbar */}
            <div className="flex flex-col flex-1 mt-[70px]">
                {/* Top Section - Dark Green #013024 - with increased height */}
                <div className="bg-[#013024] text-white px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Healthy Morning Routines</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-white text-[#013024] px-4 py-2 rounded-md flex items-center"
                            onClick={openCalendarPanel}
                        >
                            <img src="/Images/AddIcon.png" alt="Add" className="w-5 h-5 mr-2" />
                            Add to Calendar
                        </button>
                        <button className="border border-white text-white px-4 py-2 rounded-md flex items-center">
                            <img src="/Images/ShareIcon.png" alt="Share" className="w-5 h-5 mr-2" />
                            Share
                        </button>
                        <button className="text-white p-2">
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                        </button>
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
                                    <div key={card.id} className="bg-white rounded-lg shadow-md p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-1/2 flex flex-col items-start">
                                                <h3 className="font-semibold text-lg text-[#013024]">{card.title}</h3>
                                                <div className="flex items-center space-x-4">
                                                    <button className="flex items-center text-green-600 hover:text-green-800">
                                                        <img src="/Images/CopyIcon.png" alt="Copy" className="w-5 h-5 mr-1" />
                                                        Copy
                                                    </button>
                                                    <button className="flex items-center text-red-600 hover:text-red-800">
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

                    {/* Right: Notes */}
                    <div className="w-[350px] bg-[#8CB735] flex flex-col h-full min-h-[calc(100vh-150px)]">
                        <div className="p-4 border-b border-white">
                            <h2 className="text-xl font-bold text-white">Notes</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
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
                            onChange={(e) => setEditEventData(prev => ({ ...prev, title: e.target.value }))}
                        />
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
                        <div className="grid grid-cols-7 text-center text-xs border rounded shadow-lg">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="py-1 font-semibold text-[#7FAF37]">{d}</div>
                            ))}
                            {(() => {
                                const monthStart = miniCalendarMonth.startOf('month');
                                const daysInMonth = monthStart.daysInMonth();
                                const firstDay = monthStart.day();

                                const cells = [];
                                for (let i = 0; i < firstDay; i++) {
                                    cells.push(<div key={`empty-${i}`} className="py-2"></div>);
                                }

                                for (let day = 1; day <= daysInMonth; day++) {
                                    const currentDate = monthStart.date(day);
                                    const formatted = currentDate.format('YYYY-MM-DD');
                                    const isSelected = editEventData.date === formatted;

                                    cells.push(
                                        <div
                                            key={formatted}
                                            className={`py-[6px] text-xs cursor-pointer rounded-full ${isSelected ? 'bg-[#A7EC4F] text-white font-bold' : 'hover:bg-[#A7EC4F] hover:text-white'}`}
                                            onClick={() => handleDateChange(formatted)}
                                        >
                                            {day}
                                        </div>
                                    );
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
                    </div>

                    <div className="flex justify-start gap-4">
                        <button
                            className="bg-[#7FAF37] text-white px-5 py-2 rounded font-semibold hover:bg-transparent hover:text-[#7FAF37] border border-[#7FAF37] transition"
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

            <Footer />
        </div>
    );
}

export default DesignSavedResultsPage;
