import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { toast } from 'sonner';
import api from '../../../../services/api/Axios';

export default function UploadArticleImage({ articleId }: { articleId: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('articleId', articleId);

    try {
      await api.post('/article/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFile(null);
      toast.success('Article image uploaded successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {articleId && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
              Upload Article Image
            </label>
            <input
              className="dark:placeholder-#9ca3af[#9ca3af block w-full cursor-pointer rounded-lg border border-[#d1d5db] bg-[#f9fafb] text-sm text-[#111827] focus:outline-none dark:border-[#4b5563] dark:bg-[#374151] dark:text-[#9ca3af] tablet:text-lg"
              id="file_input"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </div>
          <Button variant="submit" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      )}
    </>
  );
}
