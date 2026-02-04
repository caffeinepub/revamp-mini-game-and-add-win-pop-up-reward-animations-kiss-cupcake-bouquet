import { useGetPictures } from '@/hooks/usePictures';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Image as ImageIcon, Heart } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PhotosSection() {
  const { data: pictures = [], isLoading } = useGetPictures();
  const [selectedPicture, setSelectedPicture] = useState<typeof pictures[0] | null>(null);

  const sortedPictures = [...pictures].sort((a, b) => Number(a.position) - Number(b.position));

  return (
    <section id="photos" className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our Beautiful Moments
          </h2>
          <p className="text-lg text-muted-foreground">
            Every picture tells our story
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedPictures.length === 0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
            <p className="text-muted-foreground">
              Photos will appear here once they're added
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPictures.map((picture) => (
              <Card
                key={picture.id}
                className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl heart-shadow group"
                onClick={() => setSelectedPicture(picture)}
              >
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={picture.blob.getDirectURL()}
                    alt={picture.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{picture.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{picture.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedPicture} onOpenChange={() => setSelectedPicture(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPicture?.title}</DialogTitle>
          </DialogHeader>
          {selectedPicture && (
            <div className="space-y-4">
              <img
                src={selectedPicture.blob.getDirectURL()}
                alt={selectedPicture.title}
                className="w-full rounded-lg"
              />
              <p className="text-muted-foreground">{selectedPicture.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
