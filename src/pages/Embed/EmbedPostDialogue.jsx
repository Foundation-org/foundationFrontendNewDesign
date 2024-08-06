import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import PopUp from '../../components/ui/PopUp';
import { FaSpinner } from 'react-icons/fa';
import CustomSwitch from '../../components/CustomSwitch';

export default function EmbedPostDialogue({ handleClose, modalVisible, postLink }) {
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [resultsMode, setResultsMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef();
  // Function to generate iframe code based on current state
  const generateIframeCode = () => {
    const url = `${import.meta.env.VITE_FRONTEND_URL}/embed/${postLink}?darkMode=${darkMode}&resultsMode=${resultsMode}`;
    return `<iframe
      src="${url}"
      style="width: 100%; height: 600px; border: none;"
      title="Embedded Content"
    ></iframe>`;
  };

  // Update iframeCode whenever darkMode or resultsMode changes
  const [iframeCode, setIframeCode] = useState(generateIframeCode());

  useEffect(() => {
    setIframeCode(generateIframeCode());
  }, [darkMode, resultsMode]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(iframeCode)
      .then(() => {
        toast.success('Code copied successfully');
        setCopied(true);
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const contentDocument = iframe.contentWindow.document;
      const body = contentDocument.body;

      // Navigate to the deeply nested element
      const targetElement = body.children[0]?.children[0]?.children[0]?.children[0];

      if (targetElement) {
        const height = targetElement.scrollHeight;
        console.log('height', height);
        // Set the iframe height to the target element's height
        iframe.style.height = `${height}px`;
        iframe.style.minHeight = `${height}px`;
      } else {
        console.log('Target element not found.');
      }
    } else {
      console.log('Iframe contentWindow or document is not accessible.');
    }
    setLoading(false);
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/embedPostIcon.svg`}
      title={'Embed Post'}
      open={modalVisible}
      handleClose={() => handleClose()}
    >
      <div className="flex h-full max-h-[80dvh] flex-col items-center gap-3 overflow-y-scroll py-4 no-scrollbar tablet:gap-6 tablet:py-8">
        <div className="relative size-full">
          {loading && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <FaSpinner className="animate-spin text-[10vw] text-blue-100 tablet:text-[4vw]" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={generateIframeCode().match(/src="([^"]+)"/)[1]}
            title="Embedded Content"
            onLoad={handleLoad}
            style={{ width: '100%', border: 'none' }}
            loading="lazy"
            className={`${loading ? 'invisible' : ''}`}
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center px-4">
          <p className="mx-auto pb-3 text-[10px] tablet:px-5 tablet:pb-4 tablet:text-[20px]">{iframeCode}</p>
          <Button variant={'submit'} onClick={copyToClipboard}>
            Copy Code
          </Button>
        </div>

        <div className="mb-[10px] mt-4 w-[85%] tablet:mb-7 tablet:mt-12">
          <h5 className="mt-4 text-[10px] font-semibold leading-[10px] text-gray-900 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px] dark:text-white-400">
            Embed Post Settings
          </h5>
          <div className="mt-1 flex flex-col gap-[5px] rounded-[0.30925rem] border border-white-500 bg-[#FCFCFC] py-[10px] tablet:mt-2 tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[20px] dark:border-gray-100 dark:bg-accent-100">
            <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-white-500 px-[8.62px] pb-[10.25px] pt-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
              <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
                Dark Mode
              </h5>
              <CustomSwitch enabled={darkMode} setEnabled={setDarkMode} />
            </div>
            <div className="pointer-events-none mx-[15px] flex cursor-not-allowed items-center justify-between rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px] dark:border-gray-100 dark:bg-gray-200 ">
              <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px] dark:text-white-600">
                Results Mode
              </h5>
              <CustomSwitch enabled={resultsMode} setEnabled={setResultsMode} />
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  );
}
