import { useState } from 'react';
import { useGetMessages, useAddMessage, useUpdateMessage, useDeleteMessage, useReorderMessages } from '@/hooks/useMessages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit, X, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Message } from '@/backend';

export default function MessagesEditor() {
  const { data: messages = [], isLoading } = useGetMessages();
  const addMutation = useAddMessage();
  const updateMutation = useUpdateMessage();
  const deleteMutation = useDeleteMessage();
  const reorderMutation = useReorderMessages();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const sortedMessages = [...messages].sort((a, b) => Number(a.position) - Number(b.position));

  const handleAdd = () => {
    if (!newMessage.trim()) return;
    const position = BigInt(sortedMessages.length);
    addMutation.mutate(
      { content: newMessage.trim(), position },
      {
        onSuccess: () => {
          setNewMessage('');
          setShowAddForm(false);
        },
      }
    );
  };

  const handleEdit = (message: Message) => {
    setEditingId(message.id);
    setEditContent(message.content);
  };

  const handleSaveEdit = (message: Message) => {
    if (!editContent.trim()) return;
    updateMutation.mutate(
      { id: message.id, content: editContent.trim(), position: message.position },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditContent('');
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedMessages];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    reorderMutation.mutate(newOrder.map(m => m.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedMessages.length - 1) return;
    const newOrder = [...sortedMessages];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderMutation.mutate(newOrder.map(m => m.id));
  };

  return (
    <div className="space-y-4">
      {!showAddForm ? (
        <Button onClick={() => setShowAddForm(true)} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Message
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your message..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                disabled={addMutation.isPending || !newMessage.trim()}
                className="flex-1"
              >
                {addMutation.isPending ? 'Adding...' : 'Add Message'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : sortedMessages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No messages yet. Add your first message above!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMessages.map((message, index) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Message {index + 1}</span>
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
                      disabled={index === sortedMessages.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editingId === message.id ? (
                  <>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(message)}
                        disabled={updateMutation.isPending || !editContent.trim()}
                        className="flex-1 gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(message)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(message.id)}
                        disabled={deleteMutation.isPending}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
