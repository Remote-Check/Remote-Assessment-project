import React, { useState } from 'react';
import { BaseCanvas } from './BaseCanvas';
import '../styles/canvas.css';

interface CubeDrawingTaskProps {
  onComplete: (data: string) => void;
}

export const CubeDrawingTask: React.FC<CubeDrawingTaskProps> = ({ onComplete }) => {
  const [usePhoto, setUsePhoto] = useState(false);
  const [currentDataUrl, setCurrentDataUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onComplete(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="cube-drawing-container">
      <div className="task-header">
        <h3>ציור קובייה</h3>
        <p className="instruction">העתק את הקובייה הבאה במדויק ככל האפשר:</p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 40L140 60L100 80L60 60L100 40Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M60 60L60 110L100 130L100 80L60 60Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M100 80L100 130L140 110L140 60L100 80Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {!usePhoto ? (
        <div className="canvas-section">
          <BaseCanvas onSave={setCurrentDataUrl} />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onComplete(currentDataUrl)}
              disabled={!currentDataUrl}
              className="primary-btn"
              style={{ minWidth: 180, minHeight: 56, fontSize: '1.1rem', fontWeight: 700 }}
            >
              סיימתי לצייר
            </button>
            <button
              onClick={() => setUsePhoto(true)}
              style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem' }}
            >
              אני מעדיף לצייר על דף ולצלם
            </button>
          </div>
        </div>
      ) : (
        <div className="photo-upload-section" style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #ccc', borderRadius: '8px' }}>
          <p>ציירו את הקובייה על דף חלק, צלמו אותה והעלו כאן:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ marginTop: '1rem' }}
          />
          <button
            onClick={() => setUsePhoto(false)}
            className="secondary-btn"
            style={{ display: 'block', margin: '1rem auto' }}
          >
            חזרה לציור דיגיטלי
          </button>
        </div>
      )}
    </div>
  );
};
