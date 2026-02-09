import { useGetUnlockedPictures } from '@/hooks/useUnlockedContent';
import { useGetPictures } from '@/hooks/usePictures';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Image as ImageIcon, Heart, Lock } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useAuthz';

export default function PhotosSection() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: unlockedPictures = [], isLoading: unlockedLoading } = useGetUnlockedPictures();
  const { data: adminPictures = [], isLoading: adminLoading } = useGetPictures();
  const [selectedPicture, setSelectedPicture] = useState<typeof unlockedPictures[0] | null>(null);

  const isAuthenticated = !!identity;
  
  // Admin sees all pictures, regular users see unlocked pictures, guests see nothing
  const isLoading = isAdmin ? adminLoading : unlockedLoading;
  const pictures = isAdmin ? adminPictures : unlockedPictures;

  const sortedPictures = [...pictures].sort((a, b) => Number(a.position) - Number(b.position));
  const totalSlots = 5;
  const lockedCount = Math.max(0, totalSlots - sortedPictures.length);

  return (
    <section id="photos" className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our Beautiful Moments
          </h2>
          <p className="text-lg text-muted-foreground">
            {isAuthenticated && !isAdmin ? 'Win games to unlock more photos' : 'Every picture tells our story'}
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
              {isAdmin ? 'Add photos using the settings panel' : 'Photos will appear here once unlocked'}
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

            {isAuthenticated && !isAdmin && Array.from({ length: lockedCount }).map((_, index) => (
              <Card
                key={`locked-${index}`}
                className="overflow-hidden opacity-60"
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">Locked</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Win a game to unlock
                  </p>
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
