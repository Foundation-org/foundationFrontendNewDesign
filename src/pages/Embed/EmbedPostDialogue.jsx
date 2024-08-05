import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import PopUp from '../../components/ui/PopUp';
import { FaSpinner } from 'react-icons/fa';

export default function EmbedPostDialogue({ handleClose, modalVisible, postId }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef();
  const iframeCode = `<iframe
  src="${import.meta.env.VITE_FRONTEND_URL}/embed/${postId}"
  style="width: 100%; height: 600px; border: none;"
  title="Embedded Content"
></iframe>`;

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
            src={`${import.meta.env.VITE_FRONTEND_URL}/embed/${postId}`}
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
      </div>
    </PopUp>
  );
}
