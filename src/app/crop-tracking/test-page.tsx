'use client';

import { useState, useEffect } from 'react';

interface TestData {
  message: string;
}

export default function TestCropTrackingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TestData | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData({ message: 'Test page loaded successfully!' });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Crop Tracking Test Page</h1>
      <p>{data?.message}</p>
    </div>
  );
}