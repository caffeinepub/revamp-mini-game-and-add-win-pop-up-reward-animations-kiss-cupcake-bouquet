import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { ShieldAlert } from 'lucide-react';

interface OwnerAccessDeniedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function OwnerAccessDeniedDialog({ open, onClose }: OwnerAccessDeniedDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-warning" />
            <AlertDialogTitle>Owner Access Only</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Content management is restricted to the owner account. You are currently logged in as a regular user.
            <br /><br />
            To manage pictures, messages, and treats, please log out and sign in with the owner account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
