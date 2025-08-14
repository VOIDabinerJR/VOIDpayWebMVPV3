// app/test/page.tsx
'use client';

import { useState } from 'react';

export default function TestPage() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testGetRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test');
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'Failed to connect to API' });
    } finally {
      setLoading(false);
    }
  };
 
  const testPostRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'Failed to connect to API' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">API Test Page</h1>
      
      <div className="space-x-2">
        <button
          onClick={testGetRequest}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test GET
        </button>
        <button
          onClick={testPostRequest}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test POST
        </button>
      </div>

      {loading && <p>Testing API...</p>}

      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Response:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}