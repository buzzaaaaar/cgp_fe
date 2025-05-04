import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  return (
    <div className="font-[Hanken_Grotesk] bg-[#013024] text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow px-6 md:px-20 pt-32 pb-16">
        {/* Heading */}
        <h1 className="text-4xl font-semibold text-left mb-10">Privacy Policy</h1>
        <hr className="border-[#D4D4D4] border-[1px] w-screen mt-4 mb-12 -ml-6 md:-ml-20" />

        {/* Content */}
        <div className="w-full md:w-[90%] mx-auto">
          <p className="italic text-base text-left mb-6">Last Updated: April 13, 2025</p>

          <p className="text-base leading-relaxed text-left mb-4">
            This Privacy Policy explains how we collect, use, and protect your information when you use the Rankmeone AI platform. We are committed to handling your personal data responsibly and transparently.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">1. Information We Collect</h2>
          <p className="text-base leading-relaxed text-left mb-4">
            We collect only the information necessary to support your experience on Rankmeone AI. This may include:
            <ul className="list-disc pl-5 mt-2">
              <li><strong>a. Account Information</strong><br />Email address, Password (encrypted)</li>
              <li><strong>b. User-Generated Content</strong><br />Saved content generated using AI tools, Project folders and notes, Uploaded media (e.g., images)</li>
              <li><strong>c. Usage Data</strong><br />Tools used and interaction history, Calendar events or reminders added, Dates/times of activity (for feature improvement)</li>
            </ul>
            We do not collect or store any financial or payment data.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">2. How We Use Your Information</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            Your information is used for the following purposes:
            {"\n"}• To create and manage your user account.
            {"\n"}• To store and retrieve your saved content and project folders.
            {"\n"}• To power the content calendar and reminder system.
            {"\n"}• To personalize tool recommendations.
            {"\n"}• To improve platform features based on usage trends.
            {"\n"}• To respond to user support requests or feedback.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">3. Data Security</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            We take reasonable precautions to protect your information. This includes:
            {"\n"}• Secure login authentication
            {"\n"}• Password encryption
            {"\n"}• Access restrictions for sensitive data
            {"\n"}• Use of reputable third-party services for hosting and databases (e.g., cloud providers)
            {"\n"}However, no method of online transmission or storage is 100% secure. By using Rankmeone AI, you accept this risk.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">4. AI-Generated Content</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            Rankmeone AI uses third-party AI APIs to generate content suggestions. The input you provide may be transmitted to these services solely for generating outputs — no identifiable user data is shared beyond what is necessary for the generation process.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">5. Data Retention</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            We retain your information only as long as necessary:
            {"\n"}• Account data: retained until your account is deleted
            {"\n"}• Saved content and folders: retained until you delete them manually or close your account
            {"\n"}• Inactive accounts may be removed after an extended period of inactivity (e.g., 6–12 months)
            {"\n"}You may request the deletion of your account or data at any time.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">6. Data Sharing</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            We do not sell, rent, or share your personal data with third parties for marketing or commercial purposes.
            {"\n"}We may share limited data:
            {"\n"}• With cloud/database providers for hosting and storage
            {"\n"}• If required by law or university policy in the case of misuse or legal investigation
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">7. Cookies & Tracking</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            We may use cookies or similar technologies to enhance your user experience, such as:
            {"\n"}• Saving login status
            {"\n"}• Remembering your preferred settings
            {"\n"}• Collecting basic analytics (non-personal)
            {"\n"}You can adjust your browser settings to manage or block cookies.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">8. Your Rights</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            You have the right to:
            {"\n"}• Access the data we hold about you
            {"\n"}• Request corrections to inaccurate data
            {"\n"}• Request deletion of your account and associated data
            {"\n"}• Withdraw consent to data processing (by discontinuing use of the platform)
            {"\n"}To exercise your rights, email us at support@rankmeone.ai
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">9. Platform Ownership & Changes</h2>
          <p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
            Rankmeone AI is an academic project. This policy may change as the platform evolves or transitions beyond its university scope. Significant updates will be communicated via the platform.
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
