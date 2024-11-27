import PopUp from '../../components/ui/PopUp';
import { Button } from '../../components/ui/Button';
import { FaSpinner, FaCamera } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import showToast from '../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../services/api/Axios';
import { useState, useRef, useEffect } from 'react';

// Descriptions for each step
const stepDescriptions = [
  'Step 1: Upload the front image of your identity card.',
  'Step 2: Upload the back image of your identity card.',
  'Step 3: Upload a face video or record it live.',
  'Step 4: Review and submit your identity for verification.',
];

// Helper component for file upload button
const FileUploadButton = ({ label, onChange }) => (
  <label className="cursor-pointer bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
    {label}
    <input type="file" onChange={onChange} className="hidden" />
  </label>
);

const IdentityBadgePopup = ({ isPopup, setIsPopup, title, logo }) => {
  // Redux states
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  // Local states for managing the process
  const [currentStep, setCurrentStep] = useState(1);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Close popup handler
  const handleClose = () => setIsPopup(false);

  // Reset state when popup is closed
  useEffect(() => {
    if (!isPopup) resetState();
  }, [isPopup]);

  // Reset form state
  const resetState = () => {
    setCurrentStep(1);
    setFrontImage(null);
    setBackImage(null);
    setVideo(null);
    setLoading(false);
    setRecording(false);
    recordedChunks.current = [];
  };

  // Step navigation handlers
  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1);

  // Handle video recording start
  const handleStartRecording = async () => {
    resetVideo(); // Clear previous video if any
    setRecording(true);
    setCountdown(5); // Reset countdown to 5 seconds

    // Request video/audio streams
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    // Handle video data available
    mediaRecorderRef.current.ondataavailable = (e) => recordedChunks.current.push(e.data);

    // When recording stops, save the video as a file
    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(recordedChunks.current, { type: 'video/mp4' });
      const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });
      setVideo(videoFile);  // Store the video file
      setRecording(false);
    };

    mediaRecorderRef.current.start();

    // Countdown timer logic
    startCountdown();
  };

  // Handle video recording stop
  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Start countdown logic
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleStopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle file upload (front, back images)
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Handle the form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (frontImage) formData.append('frontImage', frontImage);
      if (backImage) formData.append('backImage', backImage);
      if (video) formData.append('video', video);
      formData.append('uuid', persistedUserInfo.uuid);

      const response = await api.post(`/addIdentityBadge`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

  // Render step navigation buttons
  const renderNavigationButtons = () => (
    <div className={`w-full flex ${currentStep === 1 ? 'justify-center' : 'justify-between'}`}>
      {currentStep > 1 && (
        <Button variant="submit" onClick={goToPreviousStep}>Previous Step</Button>
      )}
      {currentStep < 4 ? (
        <Button
          variant="submit"
          onClick={goToNextStep}
          disabled={isNextStepDisabled()}
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

  // Check if the Next Step button should be disabled based on current step
  const isNextStepDisabled = () => {
    return (
      (currentStep === 1 && !frontImage) ||
      (currentStep === 2 && !backImage) ||
      (currentStep === 3 && !video)
    );
  };

  // Reset video data when starting a new recording
  const resetVideo = () => {
    if (video) setVideo(null); // Clear previous video
    recordedChunks.current = []; // Reset video chunks
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      <div className="relative overflow-hidden h-[400px] flex items-center justify-center">
        <div className={`transition-transform duration-500 transform -translate-x-${(currentStep - 1) * 100}% flex w-full`}>
          {/* Step Content */}
          <div className="min-w-full p-5 flex flex-col items-center space-y-4">
            <p className="text-center">{stepDescriptions[currentStep - 1]}</p>

            {/* Step 1: Front Image Upload */}
            {currentStep === 1 && (
              <>
                <FileUploadButton label="Choose Front Image" onChange={(e) => handleImageUpload(e, setFrontImage)} />
                {frontImage && <img src={URL.createObjectURL(frontImage)} alt="Front of ID" className="max-w-full max-h-40 object-contain mt-4" />}
              </>
            )}

            {/* Step 2: Back Image Upload */}
            {currentStep === 2 && (
              <>
                <FileUploadButton label="Choose Back Image" onChange={(e) => handleImageUpload(e, setBackImage)} />
                {backImage && <img src={URL.createObjectURL(backImage)} alt="Back of ID" className="max-w-full max-h-40 object-contain mt-4" />}
              </>
            )}

            {/* Step 3: Video Recording */}
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
                {video && <video src={URL.createObjectURL(video)} controls className="max-w-full max-h-40 mt-4" />}
              </>
            )}

            {/* Render Navigation Buttons */}
            {renderNavigationButtons()}
          </div>
        </div>
      </div>
    </PopUp>
  );
};

export default IdentityBadgePopup;
