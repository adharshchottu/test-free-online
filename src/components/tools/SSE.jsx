import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export const SSETester = () => {
  const [url, setUrl] = useState('https://sse.test-free.online');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [eventSource, setEventSource] = useState(null);

  const connectSSE = () => {
    if (eventSource) {
      eventSource.close();
    }

    setMessages([]);
    setError('');
    setStatus('Connecting...');

    if (!url) {
      setError('Please enter a valid SSE URL');
      setStatus('');
      return;
    }

    try {
      const newEventSource = new EventSource(url);

      newEventSource.onopen = () => {
        setStatus('Connected');
      };

      newEventSource.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, { data: event.data, timestamp: Date.now() }]);
      };

      newEventSource.onerror = (err) => {
        if (newEventSource.readyState === EventSource.CONNECTING) {
          setStatus('Attempting to reconnect...');
          console.log(err);
        } else {
          setError('Connection failed or server sent an error');
          setStatus('Disconnected');
          newEventSource.close();
        }
      };

      setEventSource(newEventSource);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('Connection failed');
    }
  };

  const disconnectSSE = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setStatus('Disconnected');
    }
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const renderAlert = () => {
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="font-bold">Error</p>
          </div>
          <p>{error}</p>
        </div>
      );
    }
    if (status) {
      const isConnected = status === 'Connected';
      return (
        <div className={`${isConnected ? 'bg-green-100 border-green-500 text-green-700' : 'bg-yellow-100 border-yellow-500 text-yellow-700'} border-l-4 p-4 mb-4`} role="alert">
          <div className="flex items-center">
            {isConnected ? <Info className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
            <p className="font-bold">Status</p>
          </div>
          <p>{status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className='pt-16 md:pt-16 lg:pt-24'>
    <div className="bg-bgDark3 shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="block-title mb-4">SSE Tester</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter SSE URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <button
            onClick={connectSSE}
            disabled={!url || !!eventSource}
            className="contained-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect
          </button>
          <button
            onClick={disconnectSSE}
            disabled={!eventSource}
            className="outlined-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disconnect
          </button>
        </div>
        {renderAlert()}
        <div className="border border-gray-300 rounded-md p-2 h-40 overflow-y-auto text-primaryText">
          {messages.map((msg, index) => (
            <div key={index} className="mb-1">
              {msg.data}
            </div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
};