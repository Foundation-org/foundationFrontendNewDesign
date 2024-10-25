import { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { drawImageOnCanvas, generateDownload } from '../utils/image-crop';
import { Button } from './ui/Button';

const DynamicBadgeImageCropper = ({ imgSrc, setImgSrc }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCompleteCrop = (crop) => {
    drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
    setCompletedCrop(crop);
  };

  const handleDownload = () => {
    generateDownload(canvasRef.current, completedCrop);
  };

  // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
  const canvasStyles = {
    width: Math.round(completedCrop?.width ?? 0),
    height: Math.round(completedCrop?.height ?? 0),
  };

  return (
    <div>
      {imgSrc && (
        <ReactCrop crop={crop} onChange={setCrop} aspect={1} onComplete={handleCompleteCrop}>
          <img ref={imgRef} src={imgSrc?.length === 2 ? imgSrc[0] : URL.createObjectURL(imgSrc)} alt="cropper image" />
        </ReactCrop>
      )}
      {/* Canvas to display cropped image */}
      <canvas ref={canvasRef} style={canvasStyles} />
      <div>
        <Button variant="submit" type="button" disabled={!completedCrop} onClick={handleDownload}>
          Download cropped image
        </Button>
      </div>
    </div>
  );
};

export default DynamicBadgeImageCropper;
