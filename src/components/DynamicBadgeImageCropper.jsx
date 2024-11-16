import { useRef, useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { drawImageOnCanvas } from '../utils/image-crop';

const DynamicBadgeImageCropper = ({ imgSrc, setDomainBadge }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle crop completion and draw the cropped image on the canvas
  const handleCompleteCrop = (crop) => {
    if (imgSrc.length !== 2) {
      // Only allow cropping if imgSrc is not from S3
      drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
      setCompletedCrop(crop);
    } else {
      alert('Editing is disabled. Please upload a new image to crop.');
    }
  };

  // Automatically save the cropped image as a separate field
  useEffect(() => {
    if (completedCrop && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (!blob) {
          console.error('Could not create blob from canvas');
          return;
        }

        const croppedImageURL = URL.createObjectURL(blob);

        // Update only the croppedImage field
        setDomainBadge((prev) => ({
          ...prev,
          croppedImage: croppedImageURL,
        }));
      }, 'image/png');
    }
  }, [completedCrop, setDomainBadge]);

  const canvasStyles = {
    width: Math.round(completedCrop?.width ?? 0),
    height: Math.round(completedCrop?.height ?? 0),
  };

  return (
    <div>
      {imgSrc && (
        <>
          <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
            Article Cover Image:
          </p>
          {Array.isArray(imgSrc) ? ( // Display image without cropping if it's from S3
            <>
              <img ref={imgRef} src={imgSrc[0]} alt="displayed image" style={{ maxWidth: '100%', height: 'auto' }} />
              <p className="text-[8px] text-red-500 tablet:text-[12px]">
                Editing is disabled for this image. Please upload a new image to crop.
              </p>
            </>
          ) : (
            <ReactCrop crop={crop} onChange={setCrop} aspect={1} onComplete={handleCompleteCrop}>
              <img
                ref={imgRef}
                src={Array.isArray(imgSrc) ? imgSrc[0] : URL.createObjectURL(imgSrc)}
                alt="cropper image"
              />
            </ReactCrop>
          )}
        </>
      )}

      {completedCrop &&
        imgSrc.length !== 2 && ( // Render canvas only if cropping was completed and imgSrc is not from S3
          <>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Profile Image:
            </p>
            <canvas ref={canvasRef} style={canvasStyles} />
          </>
        )}
    </div>
  );
};

export default DynamicBadgeImageCropper;