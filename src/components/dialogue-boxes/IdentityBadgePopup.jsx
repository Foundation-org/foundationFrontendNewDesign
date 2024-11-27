import PopUp from '../../components/ui/PopUp';
import { Button } from '../../components/ui/Button';
import { FaSpinner, FaCamera } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import showToast from '../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../services/api/Axios';
import { useState, useRef, useEffect } from 'react';

const stepDescriptions = [
  'Step 1: Upload the front image of your identity card.',
  'Step 2: Upload the back image of your identity card.',
  'Step 3: Upload a face video or record it live.',
  'Step 4: Review and submit your identity for verification.',
];

const IdentityBadgePopup = ({ isPopup, setIsPopup, title, logo }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [video, setVideo] = useState(null); // This will hold the File object
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown timer state
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const handleClose = () => setIsPopup(false);

  // Reset state when popup is closed
  useEffect(() => {
    if (!isPopup) {
      setCurrentStep(1);
      setFrontImage(null);
      setBackImage(null);
      setVideo(null);
      setLoading(false);
      setRecording(false);
      recordedChunks.current = [];
    }
  }, [isPopup]);

  // Move between steps
  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1);

  // Handle video recording
  const handleStartRecording = async () => {
    if (video) {
      // Clear the existing video if there is one
      setVideo(null);
      recordedChunks.current = [];
    }

    setRecording(true);
    setCountdown(5); // Reset countdown to 5 seconds

    // Request both video and audio streams
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => recordedChunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      // Convert recorded video Blob to a File object
      const videoBlob = new Blob(recordedChunks.current, { type: 'video/mp4' });
      const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });
      setVideo(videoFile);  // Store the video file object
      setRecording(false);
    };

    mediaRecorderRef.current.start();

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleStopRecording(); // Stop recording after countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle video stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Handle file uploads
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];  // Get the actual file from the input
    if (file) setImage(file);        // Set it to the state as the file object
  };

  // Handle the form submission and send FormData to the backend
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append files to FormData
      if (frontImage) formData.append('frontImage', frontImage);  // Append file object
      if (backImage) formData.append('backImage', backImage);     // Append file object
      if (video) formData.append('video', video);                 // Append the video file object (not URL)

      // Append other form data
      formData.append('identity[identity-badge]', true);
      formData.append('uuid', persistedUserInfo.uuid);

      const response = await api.post(`/addBadge/identity/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Telling the server it's multipart form data
        },
      });

      if (response.status === 200) {
        showToast('success', 'Badge added successfully');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Submission failed');
    }
    setLoading(false);
  };

  // Generic Navigation Buttons
  const renderNavigationButtons = () => (
    <div className={`w-full flex ${currentStep === 1 ? 'justify-center' : 'justify-between'}`}>
      {currentStep > 1 && (
        <Button variant="submit" onClick={goToPreviousStep}>
          Previous Step
        </Button>
      )}
      {currentStep < 4 ? (
        <Button
          variant="submit"
          onClick={goToNextStep}
          disabled={
            (currentStep === 1 && !frontImage) ||
            (currentStep === 2 && !backImage) ||
            (currentStep === 3 && !video)
          }
        >
          Next Step
        </Button>
      ) : (
        <Button variant="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <FaSpinner className="animate-spin" /> : 'Submit'}
        </Button>
      )}
    </div>
  );

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      <div className="relative overflow-hidden h-[400px] flex items-center justify-center">
        <div className={`transition-transform duration-500 transform -translate-x-${(currentStep - 1) * 100}% flex w-full`}>
          {/* Step Content */}
          <div className="min-w-full p-5 flex flex-col items-center space-y-4">
            <p className="text-center">{stepDescriptions[currentStep - 1]}</p>

            {currentStep === 1 && (
              <>
                <label className="cursor-pointer bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                  Choose Front Image
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, setFrontImage)}
                    className="hidden"
                  />
                </label>
                {frontImage && (
                  <img
                    src={URL.createObjectURL(frontImage)}
                    alt="Front of ID"
                    className="max-w-full max-h-40 object-contain mt-4"
                  />
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <label className="cursor-pointer bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                  Choose Back Image
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, setBackImage)}
                    className="hidden"
                  />
                </label>
                {backImage && (
                  <img
                    src={URL.createObjectURL(backImage)}
                    alt="Back of ID"
                    className="max-w-full max-h-40 object-contain mt-4"
                  />
                )}
              </>
            )}

            {currentStep === 3 && (
              <>
                <Button
                  onClick={handleStartRecording}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                  disabled={recording}
                >
                  <FaCamera className="mr-2" />
                  {countdown > 0 ? `Record Video (${countdown}s)` : 'Record Video'}
                </Button>
                <video ref={videoRef} autoPlay muted className="max-w-full max-h-40 mt-4" hidden={!recording} />
                {video && (
                  <video
                    src={URL.createObjectURL(video)} // Render the video
                    controls
                    className="max-w-full max-h-40 mt-4"
                  />
                )}
              </>
            )}

            {/* Render Generic Navigation Buttons */}
            {renderNavigationButtons()}
          </div>
        </div>
      </div>
    </PopUp>
  );
};

export default IdentityBadgePopup;
