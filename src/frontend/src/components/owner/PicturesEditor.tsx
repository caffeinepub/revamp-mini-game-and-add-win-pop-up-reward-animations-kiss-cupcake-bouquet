import { useState } from 'react';
import { useGetPictures, useDeletePicture, useReorderPictures } from '@/hooks/usePictures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ImageUploadDialog from './ImageUploadDialog';
import type { Picture } from '@/backend';

export default function PicturesEditor() {
  const { data: pictures = [], isLoading } = useGetPictures();
  const deleteMutation = useDeletePicture();
  const reorderMutation = useReorderPictures();
  const [editingPicture, setEditingPicture] = useState<Picture | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const sortedPictures = [...pictures].sort((a, b) => Number(a.position) - Number(b.position));

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this picture?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedPictures];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    reorderMutation.mutate(newOrder.map(p => p.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedPictures.length - 1) return;
    const newOrder = [...sortedPictures];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderMutation.mutate(newOrder.map(p => p.id));
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowAddDialog(true)} className="w-full gap-2">
        <Plus className="w-4 h-4" />
        Add Picture
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : sortedPictures.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No pictures yet. Add your first picture above!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedPictures.map((picture, index) => (
            <Card key={picture.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="line-clamp-1">{picture.title}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sortedPictures.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src={picture.blob.getDirectURL()}
                  alt={picture.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {picture.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingPicture(picture)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(picture.id)}
                    disabled={deleteMutation.isPending}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ImageUploadDialog
        open={showAddDialog || !!editingPicture}
        onClose={() => {
          setShowAddDialog(false);
          setEditingPicture(null);
        }}
        picture={editingPicture}
      />
    </div>
  );
}
