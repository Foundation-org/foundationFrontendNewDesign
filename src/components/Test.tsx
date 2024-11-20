import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import api from '../services/api/Axios';

const Test = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [image, setImage] = useState<string>(
    'https://advanced-cropper.github.io/react-advanced-cropper/img/images/karina-tess-GIgMRVBD-1s-unsplash.jpg'
  );

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onCrop = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg'));

        if (blob) {
          try {
            // Convert Blob to ArrayBuffer
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer); // Convert to Uint8Array

            // Create FormData
            const formData = new FormData();
            formData.append('file', new Blob([buffer]), 'image.png'); // Add Blob with a file name

            // Send ArrayBuffer directly in the request body (without wrapping in an object)
            // const response = await api.post('/devscript/upload', arrayBuffer, {
            //   headers: {
            //     'Content-Type': 'application/octet-stream', // Sending raw binary data
            //   },
            // });

                // Send FormData to the backend
    const response = await api.post('/devscript/upload', formData,{
      headers: {
        'Content-Type': 'application/octet-stream', // Sending raw binary data
      },
    });

  const result = await response.json();
  console.log(result);

          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      }
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    event.target.value = '';
  };

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="example">
      <div className="example__cropper-wrapper h-[500px]">
        <Cropper
          ref={cropperRef}
          className="example__cropper"
          backgroundClassName="example__cropper-background"
          src={image}
        />
      </div>
      <div className="example__buttons-wrapper">
        <button className="example__button" onClick={onUpload}>
          <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} />
          Upload image
        </button>
        {image && (
          <button className="example__button" onClick={onCrop}>
            Download result
          </button>
        )}
      </div>
    </div>
  );
};

export default Test;
