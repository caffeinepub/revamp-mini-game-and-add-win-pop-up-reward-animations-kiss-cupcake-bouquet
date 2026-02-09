import { useState, useEffect } from 'react';
import { useAddPicture, useUpdatePicture } from '@/hooks/usePictures';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { ExternalBlob } from '@/backend';
import { validateImage } from '@/utils/imageValidation';
import { humanizeBackendError } from '@/utils/humanizeBackendError';
import type { Picture } from '@/backend';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  picture?: Picture | null;
}

export default function ImageUploadDialog({ open, onClose, picture }: ImageUploadDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const addMutation = useAddPicture();
  const updateMutation = useUpdatePicture();

  useEffect(() => {
    if (picture) {
      setTitle(picture.title);
      setDescription(picture.description);
      setPreview(picture.blob.getDirectURL());
    } else {
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview('');
    }
    setError('');
    setUploadProgress(0);
  }, [picture, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validateImage(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setPreview('');
      return;
    }

    setFile(selectedFile);
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (!picture && !file) {
      setError('Please select an image');
      return;
    }

    try {
      let blob: ExternalBlob;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (picture) {
        blob = picture.blob;
      } else {
        setError('No image available');
        return;
      }

      if (picture) {
        await updateMutation.mutateAsync({
          id: picture.id,
          blob,
          title: title.trim(),
          description: description.trim(),
        });
      } else {
        await addMutation.mutateAsync({
          blob,
          title: title.trim(),
          description: description.trim(),
        });
      }

      onClose();
    } catch (err: any) {
      const humanizedError = humanizeBackendError(err);
      setError(humanizedError);
    }
  };

  const isUploading = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{picture ? 'Edit Picture' : 'Add Picture'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-2" />
              ) : (
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              )}
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG or PNG, max 5MB
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this memory..."
              rows={3}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Saving...' : picture ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
