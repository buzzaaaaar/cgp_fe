import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TermsConditions() {
  return (
    <div className="font-[Hanken_Grotesk] bg-[#013024] text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow px-6 md:px-20 pt-32 pb-16">
        {/* Heading */}
        <h1 className="text-4xl font-semibold text-left mb-10">Terms and Conditions</h1>
        <hr className="border-[#D4D4D4] border-[1px] w-screen mt-4 mb-12 -ml-6 md:-ml-20" />

        {/* Content */}
        <div className="w-full md:w-[90%] mx-auto">
          <p className="italic text-base text-left mb-6">Last Updated: April 13, 2025</p>

          <p className="text-base leading-relaxed text-left mb-4">
            Welcome to Rankmeone AI. These Terms and Conditions govern your use of our website and services.
            By accessing or using Rankmeone AI, you agree to be bound by these Terms. If you do not agree with any part
            of these Terms, please do not use the platform.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">1. Introduction</h2>
          <p className="text-base leading-relaxed text-left mb-4">
            Rankmeone AI is a web-based content creation and SEO optimization tool, developed as part of the
            PUSL2021 Computing Group Project by a group of undergraduate software engineering students at NSBM
            Green University. The platform is designed to assist users in generating and managing digital content
            using AI-assisted features.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">2. Use of the Platform</h2>
          <p className="text-base leading-relaxed text-left mb-4">
            You agree to use Rankmeone AI only for lawful purposes and in accordance with these Terms. You must not:
            <ul className="list-disc pl-5 mt-2">
              <li>Use the platform to generate or distribute harmful, offensive, or misleading content.</li>
              <li>Attempt to breach, damage, or reverse-engineer any part of the system.</li>
              <li>Violate any applicable local, national, or international laws while using our services.</li>
            </ul>
            We reserve the right to suspend or terminate access if any misuse is detected.
          </p>

          <h2 className="text-lg font-medium mb-2 mt-6">3. User Accounts</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  To access certain features, you may be required to register for an account. You are responsible for:
  {"\n"}• Providing accurate and current information.
  {"\n"}• Keeping your login credentials secure.
  {"\n"}• All activities under your account.
  {"\n\n"}We are not liable for any unauthorized access resulting from your failure to protect your account information.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">4. AI-Generated Content</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  Rankmeone AI uses artificial intelligence to suggest content such as blog topics, social media captions, hashtags,
  and SEO elements.
  {"\n\n"}•While we strive for relevance and quality, AI-generated outputs may not always be accurate, appropriate,
  or aligned with your goals.
  {"\n"}•You are solely responsible for reviewing, editing, and ensuring the suitability of any content before publishing.
  {"\n"}•Rankmeone AI and its creators are not liable for any consequences resulting from the use of AI-generated content.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">5. Intellectual Property</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  All platform design elements, logos, branding, and core functionality are the intellectual property of the
  Rankmeone AI team.
  {"\n"}•You retain rights to any original content you create or upload.
  {"\n"}•You may not reproduce, republish, or reuse any part of the platform without explicit permission.
  {"\n"}•You may not use Rankmeone AI’s name, branding, or design for commercial purposes.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">6. Privacy and Data</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  We value your privacy and aim to handle your data responsibly.
  {"\n"}•We collect and store limited information such as your login details, saved projects, uploaded media,
  and tool usage history to support your user experience.
  {"\n"}•We do not sell or share your data with third parties.
  {"\n"}•For more details, please refer to our Privacy Policy.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">7. Limitations of Liability</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  Rankmeone AI is provided “as is” as part of a university educational project.
  {"\n"}•We make no warranties regarding the accuracy, reliability, or availability of the platform or its outputs.
  {"\n"}•We are not liable for any direct, indirect, or incidental damages arising from your use of the service.
  {"\n"}•Use of the platform is at your own risk.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">8. Availability and Changes</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  Rankmeone AI is in active development.
  {"\n"}•Features and functionality may change, be removed, or be temporarily unavailable at any time without notice.
  {"\n"}•We are not responsible for any data loss or interruption due to updates or technical issues.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">9. Third-Party Tools and APIs</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  Rankmeone AI integrates with third-party APIs (e.g., for AI-generated content and media tools).
  {"\n"}•We do not control or guarantee the performance or content provided by third-party services.
  {"\n"}•Your use of those services may be subject to their own terms and policies.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">10. Termination</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  We reserve the right to suspend or permanently disable accounts that violate these Terms or misuse the platform.
  {"\n"}You may also choose to discontinue using the platform at any time.
</p>

<h2 className="text-lg font-medium mb-2 mt-6">11. Governing Law</h2>
<p className="text-base leading-relaxed text-left mb-4 whitespace-pre-line">
  These Terms are governed by the laws and regulations of Sri Lanka,and any disputes will be handled under that jurisdiction.
</p>


        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TermsConditions;
