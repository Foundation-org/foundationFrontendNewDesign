import { useRef, useState } from 'react';
import PopUp from '../../components/ui/PopUp';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';

export default function EmbedPostDialogue({ handleClose, modalVisible, postId }) {
  const [copied, setCopied] = useState(false);
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
        // Set the iframe height to the target element's height
        iframe.style.height = `${height}px`;
      } else {
        console.log('Target element not found.');
      }
    } else {
      console.log('Iframe contentWindow or document is not accessible.');
    }
  };

  return (
    <PopUp logo={``} title={'Embed Post'} open={modalVisible} handleClose={() => handleClose()}>
      <div className="flex max-h-[80dvh] flex-col items-center gap-6 overflow-y-scroll py-8 no-scrollbar">
        <div className="flex w-full justify-center ">
          <iframe
            ref={iframeRef}
            src={`${import.meta.env.VITE_FRONTEND_URL}/embed/${postId}`}
            title="Embedded Content"
            onLoad={handleLoad}
            style={{ width: '100%', border: 'none' }}
          ></iframe>
        </div>
        <div className="flex w-full max-w-4xl flex-col items-center">
          <code className="block w-full overflow-auto rounded-md p-4 text-gray-300">{iframeCode}</code>
          <Button variant={'submit'} onClick={copyToClipboard}>
            Copy Code
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
