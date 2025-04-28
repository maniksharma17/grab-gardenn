'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface ImageMagnifierLensProps {
  src: string;
  zoom?: number;
}

const ImageMagnifierLens = ({ src, zoom = 2 }: ImageMagnifierLensProps) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current) return;

    const bounds = imgRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const xPercent = Math.min(Math.max(x / bounds.width, 0), 1);
    const yPercent = Math.min(Math.max(y / bounds.height, 0), 1);

    setPosition({ x: xPercent, y: yPercent });
  };

  return (
    <div
      className={`relative ${showZoom ? 'fixed inset-0 bg-black/80 flex items-center justify-center z-50' : ''}`}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative">
        <Image
          ref={imgRef}
          src={src}
          alt="Zoomable"
          width={500}
          height={500}
          className="object-contain rounded-lg max-h-[80vh]"
        />
        {showZoom && (
          <div
            className="absolute border-2 border-white/70 bg-white/10 backdrop-blur-sm pointer-events-none"
            style={{
              width: '100px',
              height: '100px',
              top: `${position.y * imgRef.current!.height - 50}px`,
              left: `${position.x * imgRef.current!.width - 50}px`,
            }}
          />
        )}
      </div>

      {showZoom && (
        <div className="ml-10 w-[400px] h-[400px] overflow-hidden rounded-lg border-2 border-white/20 relative">
          <Image
            src={src}
            alt="Zoomed"
            width={imgRef.current ? imgRef.current.width * zoom : 1000}
            height={imgRef.current ? imgRef.current.height * zoom : 1000}
            style={{
              transform: `translate(-${position.x * (imgRef.current?.width || 0) * (zoom - 1)}px, -${position.y * (imgRef.current?.height || 0) * (zoom - 1)}px)`,
            }}
            className="absolute top-0 left-0 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageMagnifierLens;
