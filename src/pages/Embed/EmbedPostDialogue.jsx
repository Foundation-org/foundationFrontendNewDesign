import React, { useState } from 'react';
import PopUp from '../../components/ui/PopUp';
import { toast } from 'sonner';

export default function EmbedPostDialogue({ handleClose, modalVisible, postId }) {
  const [copied, setCopied] = useState(false);

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

  return (
    <PopUp logo={``} title={'Embed Post'} open={modalVisible} handleClose={() => handleClose()}>
      <div className="flex flex-col items-center gap-6">
        {/* Iframe Section */}
        <div className="flex w-full justify-center">
          <iframe
            src={`${import.meta.env.VITE_FRONTEND_URL}/embed/${postId}`}
            className="h-[350px] w-full max-w-4xl"
            title="Embedded Content"
          ></iframe>
        </div>

        {/* Code Section */}
        <div className="flex w-full max-w-4xl flex-col items-center">
          <code className="block w-full overflow-auto rounded-md bg-silver-100 p-4">{iframeCode}</code>
          <button onClick={copyToClipboard} className="mt-4 rounded-md bg-blue-500 p-2 text-white">
            Copy
          </button>
        </div>
      </div>
    </PopUp>
  );
}
