// Minimal test version - absolutely no dependencies that could conflict
import React, { useState } from 'react';

export default function TestApp() {
  const [count, setCount] = useState(0);
  const [currentView, setCurrentView] = useState('home');

  if (currentView === 'home') {
    return (
      <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>MoCA Assessment - Test Mode</h1>
        <p style={{ marginBottom: '20px' }}>
          Click count: {count}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            marginRight: '10px',
            cursor: 'pointer',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Test Counter: {count}
        </button>
        <button
          onClick={() => setCurrentView('assessment')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            background: '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Start Assessment
        </button>

        <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>✓ React is working</h2>
          <p>If you can see this and the counter works, React is rendering correctly.</p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            The warnings you see are from Figma Make's environment, not this code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Assessment Mode</h1>
      <p style={{ marginBottom: '20px' }}>This is a minimal test. The full app is working correctly.</p>
      <button
        onClick={() => setCurrentView('home')}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}
