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
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current || !imgContainerRef.current) return;

    const bounds = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const xPercent = Math.min(Math.max(x / bounds.width, 0), 1);
    const yPercent = Math.min(Math.max(y / bounds.height, 0), 1);

    setPosition({ x: xPercent, y: yPercent });
  };

  return (
    <>
      {/* This is the normal non-fullscreen image */}
      <div
        className="relative cursor-zoom-in"
        onMouseEnter={() => setShowZoom(true)}
      >
        <Image
          src={src}
          alt="Product Image"
          width={500}
          height={500}
          className="object-cover rounded-lg"
        />
      </div>

      {/* Fullscreen gallery with zoom */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <div className="flex max-w-7xl w-full h-full items-center justify-center gap-10 px-10">
            {/* Main image with highlight */}
            <div
              ref={imgContainerRef}
              className="relative flex-1 flex items-center justify-center"
            >
              <Image
                ref={imgRef}
                src={src}
                alt="Main Image"
                width={800}
                height={800}
                className="object-contain max-h-[90vh] rounded-lg"
              />
              {/* Highlight box */}
              <div
                className="absolute border-2 border-white/70 bg-white/10 backdrop-blur-sm pointer-events-none"
                style={{
                  width: '150px',
                  height: '150px',
                  top: `calc(${position.y * 100}% - 75px)`,
                  left: `calc(${position.x * 100}% - 75px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>

            {/* Zoomed image */}
            <div className="relative w-[500px] h-[500px] overflow-hidden border-2 border-white/30 rounded-lg">
              <Image
                src={src}
                alt="Zoomed Image"
                width={imgRef.current ? imgRef.current.width * zoom : 1600}
                height={imgRef.current ? imgRef.current.height * zoom : 1600}
                style={{
                  transform: `translate(-${position.x * (imgRef.current?.width || 0) * (zoom - 1)}px, -${position.y * (imgRef.current?.height || 0) * (zoom - 1)}px)`,
                }}
                className="absolute top-0 left-0 object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageMagnifierLens;
