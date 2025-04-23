'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface ImageMagnifierLensProps {
  src: string;
  zoom?: number;
  lensSize?: number;
}

const ImageMagnifierLens = ({ src, zoom = 2, lensSize = 150 }: ImageMagnifierLensProps) => {
  const [showLens, setShowLens] = useState(false);
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
    <div
      className="relative w-full max-w-md overflow-hidden"
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        ref={imgRef}
        src={src}
        height={500}
        width={500}
        layout="responsive"
        objectFit="cover"
        alt="Zoomable"
        className="w-full h-full aspect-square object-cover rounded-lg"
      />
      {showLens && (
        <div
          className="absolute rounded-full pointer-events-none border-2 border-gray-300 shadow-md"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            top: `${lensPosition.y - lensSize / 2}px`,
            left: `${lensPosition.x - lensSize / 2}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgRef.current!.width * zoom}px ${imgRef.current!.height * zoom}px`,
            backgroundPosition: `-${lensPosition.x * zoom - lensSize / 2}px -${lensPosition.y * zoom - lensSize / 2}px`,
            backgroundRepeat: 'no-repeat',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifierLens;
