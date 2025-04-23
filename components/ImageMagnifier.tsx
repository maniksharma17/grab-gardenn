// components/ImageMagnifier.tsx
'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface Props {
  src: string;
  zoom?: number;
}

const ImageMagnifier = ({ src, zoom = 2 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = containerRef.current!.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full max-w-md h-[500px] border overflow-hidden rounded-lg"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${zoom * 100}%`,
        backgroundPosition,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Image
        src={src}
        alt="Product"
        className="opacity-0 w-full h-full object-cover"
        height={500}
        width={500}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ImageMagnifier;
