import React, { useEffect, useRef, useState } from 'react';

const Advertisement = ({ searchQuery, toolType }) => {
  const adRef = useRef(null);
  const isInitialized = useRef(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    // Only initialize if not already initialized
    if (isInitialized.current) {
      return;
    }

    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9752645303556856';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onerror = () => {
        setIsAdBlocked(true);
      };

      script.onload = () => {
        if (adRef.current && !isInitialized.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isInitialized.current = true;
        }
      };

      document.head.appendChild(script);
    } else if (adRef.current && !isInitialized.current) {
      // Script already loaded, initialize immediately
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isInitialized.current = true;
    }

    return () => {
      // Cleanup if needed
      if (adRef.current) {
        adRef.current = null;
      }
    };
  }, []);

  if (isAdBlocked) {
    return (
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold text-[#7FAF37] text-center mb-4">Advertisement</h2>
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-center text-gray-500">
            Please disable your ad blocker to see advertisements
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-xl font-semibold text-[#7FAF37] text-center mb-4">Advertisement</h2>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9752645303556856"
          data-ad-slot="5381170215"
          data-ad-format="auto"
          data-adtest="on"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default Advertisement; 