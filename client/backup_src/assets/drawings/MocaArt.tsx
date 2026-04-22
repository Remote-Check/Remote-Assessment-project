import React from 'react';

interface ArtProps {
  width?: number;
  style?: React.CSSProperties;
}

const LionArt: React.FC<ArtProps> = ({ width = 240, style }) => {
  return (
    <svg width={width} height={width} viewBox="0 0 400 400" fill="none"
         xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M200 100 C 280 100, 320 180, 320 250 C 320 320, 240 340, 200 340 C 160 340, 80 320, 80 250 C 80 180, 120 100, 200 100" 
            stroke="#000" strokeWidth="3" strokeLinecap="round" />
      <path d="M160 160 Q 200 140 240 160" stroke="#000" strokeWidth="2.5" />
      <circle cx="165" cy="210" r="12" fill="#000" />
      <circle cx="235" cy="210" r="12" fill="#000" />
      <path d="M190 240 L 210 240 L 200 260 Z" fill="#000" />
      <path d="M170 280 Q 200 300 230 280" stroke="#000" strokeWidth="3" />
      <path d="M100 120 Q 80 160 100 200" stroke="#000" strokeWidth="2" strokeDasharray="8 6" />
      <path d="M300 120 Q 320 160 300 200" stroke="#000" strokeWidth="2" strokeDasharray="8 6" />
    </svg>
  );
};

const RhinoArt: React.FC<ArtProps> = ({ width = 240, style }) => {
  return (
    <svg width={width} height={width} viewBox="0 0 400 400" fill="none"
         xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M80 260 Q 60 200 140 180 Q 180 120 220 140 Q 280 140 320 180 L 340 260 L 320 340 H 100 L 80 260"
            stroke="#000" strokeWidth="3" />
      <path d="M145 185 L 160 120 L 175 180" stroke="#000" strokeWidth="4" />
      <path d="M185 175 L 195 145 L 205 175" stroke="#000" strokeWidth="3" />
      <circle cx="260" cy="220" r="10" fill="#000" />
    </svg>
  );
};

const CamelArt: React.FC<ArtProps> = ({ width = 240, style }) => {
  return (
    <svg width={width} height={width} viewBox="0 0 400 400" fill="none"
         xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M80 340 L 100 220 Q 120 160 160 160 Q 200 160 220 220 Q 240 160 280 160 Q 320 160 340 220 L 360 340"
            stroke="#000" strokeWidth="3" />
      <path d="M340 220 Q 380 200 380 140 Q 380 100 340 100" stroke="#000" strokeWidth="3" />
      <circle cx="360" cy="140" r="8" fill="#000" />
    </svg>
  );
};

export const MocaArt = { Lion: LionArt, Rhino: RhinoArt, Camel: CamelArt };
