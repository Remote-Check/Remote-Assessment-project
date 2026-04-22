import React from 'react';

// Ultra-minimal version to test if ANYTHING renders
export default function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>
        ✓ MoCA Assessment App
      </h1>
      
      <div style={{ 
        padding: '20px', 
        background: '#f0f9ff', 
        border: '2px solid #0066ff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', color: '#0066ff', marginBottom: '10px' }}>
          App Status: WORKING
        </h2>
        <p style={{ lineHeight: '1.6' }}>
          If you can see this message, React is rendering correctly. 
          The warnings in the console are from Figma Make's preview environment, 
          not from your application code.
        </p>
      </div>

      <div style={{ 
        padding: '20px', 
        background: '#fff3cd', 
        border: '2px solid #ffc107',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>⚠️ About the Warnings</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>
          <strong>"Detected multiple Jotai instances"</strong> - This is from Figma's internal rendering system. Your code does not use Jotai.
        </p>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <strong>"Multiple renderers"</strong> - This is from Figma's preview iframe. Your code has no Context providers causing this.
        </p>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#e8e8e8', borderRadius: '4px' }}>
        <p style={{ fontSize: '12px', color: '#666' }}>
          <strong>Next step:</strong> To load the full MoCA assessment app, restore the original App.tsx from App.backup.tsx
        </p>
      </div>
    </div>
  );
}
