import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../styles/canvas.css';

interface BaseCanvasProps {
  onSave: (dataUrl: string) => void;
  children?: React.ReactNode;
}

interface Point {
  x: number;
  y: number;
}

export const BaseCanvas: React.FC<BaseCanvasProps> = ({ onSave, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // Redraw all paths whenever paths state changes
  const redraw = useCallback((ctx: CanvasRenderingContext2D, pathsToDraw: Point[][]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    pathsToDraw.forEach((path) => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    });
  }, []);

  // Handle resizing and initial setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Only resize if different to avoid infinite redraws
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        redraw(ctx, paths);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [paths, redraw]);

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getPointerPos(e);
    setCurrentPath([pos]);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPointerPos(e);
    const newPath = [...currentPath, pos];
    setCurrentPath(newPath);

    // Immediate visual feedback
    redraw(ctx, [...paths, newPath]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 0) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);
      onSave(canvasRef.current?.toDataURL() || '');
    }
    setCurrentPath([]);
  };

  const undo = () => {
    const newPaths = paths.slice(0, -1);
    setPaths(newPaths);
    onSave(canvasRef.current?.toDataURL() || '');
  };

  const clear = () => {
    setPaths([]);
    onSave('');
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          style={{ cursor: 'crosshair' }}
        />
        {children}
      </div>
      <div className="canvas-controls">
        <button 
          onClick={undo} 
          className="secondary-btn"
          disabled={paths.length === 0}
        >
          ביטול פעולה
        </button>
        <button 
          onClick={clear} 
          className="secondary-btn"
          disabled={paths.length === 0}
        >
          נקה הכל
        </button>
      </div>
    </div>
  );
};
