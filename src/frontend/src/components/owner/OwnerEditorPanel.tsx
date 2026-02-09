import { useState } from 'react';
import { useIsCallerAdmin } from '@/hooks/useAuthz';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Image, MessageCircle, Cake } from 'lucide-react';
import PicturesEditor from './PicturesEditor';
import MessagesEditor from './MessagesEditor';
import TreatsEditor from './TreatsEditor';
import OwnerAccessDeniedDialog from './OwnerAccessDeniedDialog';

export default function OwnerEditorPanel() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();
  const [open, setOpen] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  // Don't show anything while loading
  if (isLoading) {
    return null;
  }

  // If user is authenticated but not admin, show the settings button that opens access denied dialog
  if (identity && !isAdmin) {
    return (
      <>
        <Button
          onClick={() => setShowAccessDenied(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl z-50"
          size="icon"
        >
          <Settings className="w-6 h-6" />
        </Button>
        <OwnerAccessDeniedDialog 
          open={showAccessDenied} 
          onClose={() => setShowAccessDenied(false)} 
        />
      </>
    );
  }

  // If not authenticated or not admin, don't show anything
  if (!isAdmin) {
    return null;
  }

  // Admin user - show full editor panel
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl z-50"
          size="icon"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Content</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="pictures" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pictures" className="gap-2">
              <Image className="w-4 h-4" />
              Pictures
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="treats" className="gap-2">
              <Cake className="w-4 h-4" />
              Treats
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pictures" className="mt-6">
            <PicturesEditor />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessagesEditor />
          </TabsContent>
          <TabsContent value="treats" className="mt-6">
            <TreatsEditor />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
