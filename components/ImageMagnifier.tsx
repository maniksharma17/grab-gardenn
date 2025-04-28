'use client';

import React, { useRef, useState } from 'react';

interface ImageMagnifierLensProps {
  src: string;
  zoom?: number;
}

const ImageMagnifierLens = ({ src, zoom = 2 }: ImageMagnifierLensProps) => {
  const [showZoom, setShowZoom] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bounds = imgRef.current!.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const lensX = Math.max(0, Math.min(x, bounds.width));
    const lensY = Math.max(0, Math.min(y, bounds.height));

    setLensPosition({ x: lensX, y: lensY });
  };

  return (
    <div className="flex w-screen justify-center items-center gap-8 p-8 box-border">
      {/* Main Image */}
      <div
        className="relative w-[500px] h-[500px] overflow-hidden"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Zoomable"
          className="object-cover w-full h-full rounded-lg"
        />
      </div>

      {/* Zoomed Section */}
      {showZoom && imgRef.current && (
        <div
          className="w-[500px] h-[500px] border border-gray-300 overflow-hidden rounded-lg shadow-md bg-white"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgRef.current.width * zoom}px ${imgRef.current.height * zoom}px`,
            backgroundPosition: `-${lensPosition.x * zoom - 250}px -${lensPosition.y * zoom - 250}px`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifierLens;
