import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!name.trim()) throw new Error('Name is required');
      await actor.saveCallerUserProfile({ name: name.trim() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            Welcome!
          </DialogTitle>
          <DialogDescription>
            Please enter your name to set up your profile as the site owner.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={saveMutation.isPending || !name.trim()}
          >
            {saveMutation.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
