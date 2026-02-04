import { useState } from 'react';
import { useIsCallerAdmin } from '@/hooks/useAuthz';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Image, MessageCircle } from 'lucide-react';
import PicturesEditor from './PicturesEditor';
import MessagesEditor from './MessagesEditor';

export default function OwnerEditorPanel() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const [open, setOpen] = useState(false);

  if (isLoading || !isAdmin) {
    return null;
  }

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pictures" className="gap-2">
              <Image className="w-4 h-4" />
              Pictures
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Messages
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pictures" className="mt-6">
            <PicturesEditor />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessagesEditor />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
