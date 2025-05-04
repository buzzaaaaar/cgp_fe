import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="font-[Hanken_Grotesk] bg-[#013024] text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow px-6 md:px-20 pt-32 pb-16">
        {/* Heading */}
        <h1 className="text-4xl font-semibold text-left mb-10">Frequently Asked Questions</h1>
        <hr className="border-[#D4D4D4] border-[1px] w-screen mt-4 mb-12 -ml-6 md:-ml-20" />

        {/* Content */}
        <div className="w-full md:w-[90%] mx-auto">
          {/* Removed "Last Updated" Text */}

          {/* Question 1 */}
          <div className="mb-4">
            <div
              className="bg-[#7FAF37] p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(1)}
            >
              <p className="text-base font-bold text-left">Do I need SEO knowledge to use this platform?</p>
              <span className="text-xl font-semibold">{openIndex === 1 ? '-' : '+'}</span>
            </div>
            {openIndex === 1 && (
              <div className="bg-white text-black p-4 mt-2">
                <p className="text-base font-semibold">
                  Nope! Rankmeone AI is built to simplify SEO for everyone. The tools are designed to guide you
                  through content generation and optimization, even if you have no technical background.
                </p>
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="mb-4">
            <div
              className="bg-[#7FAF37] p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(2)}
            >
              <p className="text-base font-bold text-left">How does the calendar work?</p>
              <span className="text-xl font-semibold">{openIndex === 2 ? '-' : '+'}</span>
            </div>
            {openIndex === 2 && (
              <div className="bg-white text-black p-4 mt-2">
                <p className="text-base font-semibold">
                  You can add reminders for content (like posts or campaigns) directly from your saved designs. Once added, they appear in the calendar, where you can view and manage all your scheduled tasks.
                </p>
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="mb-4">
            <div
              className="bg-[#7FAF37] p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(3)}
            >
              <p className="text-base font-bold text-left">Can I collaborate with others on my projects?</p>
              <span className="text-xl font-semibold">{openIndex === 3 ? '-' : '+'}</span>
            </div>
            {openIndex === 3 && (
              <div className="bg-white text-black p-4 mt-2">
                <p className="text-base font-semibold">
                  Yes! Rankmeone AI supports collaboration features so you and your team can work on the same projects, share ideas, and stay on track with deadlines.
                </p>
              </div>
            )}
          </div>

          {/* Question 4 */}
          <div className="mb-4">
            <div
              className="bg-[#7FAF37] p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(4)}
            >
              <p className="text-base font-bold text-left">Is Rankmeone AI free to use?</p>
              <span className="text-xl font-semibold">{openIndex === 4 ? '-' : '+'}</span>
            </div>
            {openIndex === 4 && (
              <div className="bg-white text-black p-4 mt-2">
                <p className="text-base font-semibold">
                  Yes, the platform is currently free to use as part of a student-led academic project. Some features may be updated or limited based on testing and development.
                </p>
              </div>
            )}
          </div>

          {/* Question 5 */}
          <div className="mb-4">
            <div
              className="bg-[#7FAF37] p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(5)}
            >
              <p className="text-base font-bold text-left">Can I delete my saved content or account?</p>
              <span className="text-xl font-semibold">{openIndex === 5 ? '-' : '+'}</span>
            </div>
            {openIndex === 5 && (
              <div className="bg-white text-black p-4 mt-2">
                <p className="text-base font-semibold">
                  Absolutely. You can delete individual results, folders, or your entire account at any time from your profile or project pages.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FAQ;
