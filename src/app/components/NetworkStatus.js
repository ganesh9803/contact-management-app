"use client"; // Ensures this component is rendered on the client-side

import { useEffect, useState } from 'react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (typeof navigator !== 'undefined') {
        const onlineStatus = navigator.onLine;
        setIsOnline(onlineStatus);
        
        if (onlineStatus) {
          // Show "Network Online" message for a short time when connection is restored
          setShowOnlineMessage(true);
          setTimeout(() => setShowOnlineMessage(false), 3000); // 3 seconds
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check for online status
    updateOnlineStatus();

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Offline message
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2">
        No Network Connection
      </div>
    );
  }

  // Online message (temporarily shown for 3 seconds)
  if (showOnlineMessage) {
    return (
      <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2">
        Network Online
      </div>
    );
  }

  return null;
}
