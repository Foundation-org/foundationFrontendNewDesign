import { Button } from './ui/Button';
import { useEffect, useRef } from 'react';
import { CircleStencil, Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface ImageCropperProps {
  type: '16:9' | 'rounded';
  onCropComplete: (blob: Blob | null) => void;
  image: string;
}

const ImageCropper = (props: ImageCropperProps) => {
  const { type, onCropComplete, image } = props;
  const cropperRef = useRef<CropperRef>(null);

  const onCrop = async () => {
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

  useEffect(() => {
    // Clean up the image URL when the component unmounts
    return () => {
      if (image && typeof image === 'string' && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

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
        />
      )}
      {type === 'rounded' && (
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-[220px] w-full tablet:h-[380px]"
          stencilComponent={CircleStencil}
        />
      )}

      <Button variant="submit" onClick={onCrop}>
        Confirm Crop
      </Button>
    </div>
  );
};

export default ImageCropper;
