import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <div className="font-[Hanken_Grotesk] bg-[#013024] text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow px-6 md:px-20 pt-32 pb-16">
        {/* About Us Heading */}
        <h1 className="text-4xl font-semibold text-left mb-10">About Us</h1>
        <hr className="border-[#D4D4D4] border-[1px] w-screen mt-4 mb-12 -ml-6 md:-ml-20" />

        {/* Two side-by-side square boxes */}
        <div className="flex flex-col md:flex-row w-full justify-center mb-16"> {/* Added margin-bottom here */}
          {/* OUR MISSION box */}
          <div className="bg-[#A7EC4F] text-white p-6 w-full md:w-[50%] h-[400px] flex flex-col justify-start font-[Hanken_Grotesk]">
            <h2 className="text-2xl font-medium mb-4 text-left">OUR MISSION</h2>
            <p className="text-left text-base leading-relaxed">
              At Rankmeone AI, our mission is simple:
              <br /><br />
              To empower content creators with smart, intuitive tools that help them grow,
              stay organized, and rank better online without needing to be SEO experts.
              In today’s fast-moving digital world, creating quality content is only half the battle.
              Visibility is everything.
              That’s why we built a platform that combines AI-powered SEO tools with thoughtful project
              management features, making it easier than ever to plan, optimize, and execute your content
              strategy — all in one place.
            </p>
          </div>

          {/* WHO WE ARE box */}
          <div className="bg-[#7FAF37] text-white p-6 w-full md:w-[50%] h-[400px] flex flex-col justify-start items-end text-right font-[Hanken_Grotesk]">
            <h2 className="text-2xl font-medium mb-4">WHO WE ARE</h2>
            <p className="text-base leading-relaxed">
              We’re a team of undergraduate software engineering students at NSBM Green University,
              working together on a collaborative project for the PUSL2021 Computing Group Module.
              <br /><br />
              With diverse backgrounds and a shared passion for technology, design, and content strategy,
              we created Rankmeone AI as a response to a real-world challenge faced by creators everywhere —
              how to get noticed in a crowded digital space...
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
