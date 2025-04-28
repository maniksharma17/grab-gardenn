'use client';

import Image from 'next/image';
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
    <div className="flex w-screen gap-8">
      <div
        className="relative w-screen h-[500px] overflow-hidden"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          ref={imgRef}
          src={src}
          alt="Zoomable"
          width={500}
          height={500}
          className="object-cover w-[500px] h-[500px] rounded-lg"
        />
      </div>

      {showZoom && (
        <div
          className="w-[300px] h-[300px] border border-gray-300 overflow-hidden rounded-lg shadow-md"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgRef.current!.width * zoom}px ${imgRef.current!.height * zoom}px`,
            backgroundPosition: `-${lensPosition.x * zoom - 150}px -${lensPosition.y * zoom - 150}px`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifierLens;
