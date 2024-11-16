import React, { useEffect, useState } from 'react';

const UserCount = () => {
  const [userCount, setUserCount] = useState(1);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`https://users-count-server.test-free.online/api/count-user?url=${encodeURIComponent(window.location.href)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserCount(JSON.parse(data.data).count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    // Fetch user count on mount
    fetchUserCount();

    // Fetch user count every 10 seconds
    const interval = setInterval(fetchUserCount, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-1 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="mt-16 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col bg-white/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-300">
                Live Users Count
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                <div className="relative inline-flex">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
                </div> {userCount}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserCount;
