import { useEffect, useRef, useCallback } from 'react';
import { CircleStencil, Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface ImageCropperProps {
  type: '16:9' | 'rounded';
  onCropComplete: (blob: Blob | null) => void;
  image: string;
}

// Utility debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const ImageCropper = (props: ImageCropperProps) => {
  const { type, onCropComplete, image } = props;
  const cropperRef = useRef<CropperRef>(null);

  const handleCrop = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg'));
        onCropComplete(blob);
      } else {
        onCropComplete(null);
      }
    }
  };

  // Debounced version of handleCrop
  const debouncedHandleCrop = useCallback(debounce(handleCrop, 500), []);

  useEffect(() => {
    // Clean up the image URL when the component unmounts
    return () => {
      if (image && typeof image === 'string' && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const onCropUpdate = () => {
    debouncedHandleCrop();
  };

  return (
    <div className="w-full space-y-1 tablet:space-y-3">
      {type === '16:9' && (
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-[220px] w-full tablet:h-[380px]"
          stencilProps={{
            aspectRatio: 16 / 9,
          }}
          onChange={onCropUpdate}
        />
      )}
      {type === 'rounded' && (
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-[220px] w-full tablet:h-[380px]"
          stencilComponent={CircleStencil}
          onChange={onCropUpdate}
        />
      )}
    </div>
  );
};

export default ImageCropper;
