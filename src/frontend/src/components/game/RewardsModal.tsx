import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart } from 'lucide-react';

interface RewardsModalProps {
  open: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
}

export default function RewardsModal({ open, onClose, onPlayAgain }: RewardsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Your Rewards!
            <Sparkles className="w-8 h-8 text-primary" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg pt-2">
            You did it! Here are your special Valentine's rewards
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 py-6">
          <div className="text-center space-y-3">
            <div className="aspect-square rounded-2xl bg-accent/10 p-6 flex items-center justify-center">
              <img
                src="/assets/generated/bouquet.dim_512x512.png"
                alt="Bouquet"
                className="w-full h-full object-contain animate-in zoom-in duration-500"
              />
            </div>
            <p className="font-semibold text-lg">A Bouquet</p>
          </div>

          <div className="text-center space-y-3">
            <div className="aspect-square rounded-2xl bg-accent/10 p-6 flex items-center justify-center">
              <img
                src="/assets/generated/kiss.dim_512x512.png"
                alt="Kiss"
                className="w-full h-full object-contain animate-in zoom-in duration-500 delay-150"
              />
            </div>
            <p className="font-semibold text-lg">A Kiss</p>
          </div>

          <div className="text-center space-y-3">
            <div className="aspect-square rounded-2xl bg-accent/10 p-6 flex items-center justify-center">
              <img
                src="/assets/generated/cupcake.dim_512x512.png"
                alt="Cupcake"
                className="w-full h-full object-contain animate-in zoom-in duration-500 delay-300"
              />
            </div>
            <p className="font-semibold text-lg">A Cupcake</p>
          </div>
        </div>

        <div className="text-center space-y-4 pt-4 border-t">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            Made with love, just for you
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" onClick={onClose} className="rounded-full">
              Close
            </Button>
            <Button size="lg" variant="outline" onClick={onPlayAgain} className="rounded-full">
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
