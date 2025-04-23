// components/ProductImageMagnifier.tsx
import React from 'react';
import ReactImageMagnify from 'react-image-magnify';

const ProductImageMagnifier = ({ src }: { src: string }) => {
  return (
    <div className="w-full max-w-md">
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: 'Product Image',
            isFluidWidth: true,
            src: src,
          },
          largeImage: {
            src: src,
            width: 1200,
            height: 1800,
          },
          enlargedImageContainerDimensions: {
            width: '200%',
            height: '200%',
          },
          lensStyle: { backgroundColor: 'rgba(0,0,0,.2)' },
        }}
      />
    </div>
  );
};

export default ProductImageMagnifier;
