import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ContactUs() {
  return (
    <div className="font-[Hanken_Grotesk] bg-[#013024] text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow px-6 md:px-20 pt-32 pb-16">
        {/* Contact Us Heading */}
        <h1 className="text-4xl font-semibold text-left mb-10">Contact Us</h1>

        {/* Line Below Heading */}
        <hr className="border-[#D4D4D4] border-[1px] w-screen mt-4 mb-12 -ml-6 md:-ml-20" />

        {/* Contact Info Box */}
        <div className="flex flex-col md:flex-row w-full justify-center mb-16"> 
          {/* Contact Info Box */}
          <div className="bg-[#7FAF37] text-white px-10 py-10 w-full md:w-[100%] h-[400px] flex flex-col justify-start font-[Hanken_Grotesk]">
            <h2 className="text-2xl font-medium mb-4 text-left">
              For any questions about using Rankmeone AI, our features, or technical support:
            </h2> <br />
            <p className="text-left text-base leading-relaxed">
              <strong>Email Address:</strong> support@rankmeone.ai
              <br />
              <strong>Mobile Number:</strong> +94 123 456 789
              <br />
              <strong>Address:</strong> 63A, This Road, That Place, Sri Lanka
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ContactUs;
