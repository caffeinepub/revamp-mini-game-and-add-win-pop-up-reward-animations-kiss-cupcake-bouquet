import { useState } from 'react';
import { useGetAllTreats, useAddTreat, useUpdateTreat, useDeleteTreat, useReorderTreats } from '@/hooks/useTreats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit, X, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { SweetTreat } from '@/backend';

export default function TreatsEditor() {
  const { data: treats = [], isLoading } = useGetAllTreats();
  const addMutation = useAddTreat();
  const updateMutation = useUpdateTreat();
  const deleteMutation = useDeleteTreat();
  const reorderMutation = useReorderTreats();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const sortedTreats = [...treats].sort((a, b) => Number(a.position) - Number(b.position));

  const handleAdd = () => {
    if (!newName.trim()) return;
    const position = BigInt(sortedTreats.length);
    addMutation.mutate(
      { name: newName.trim(), description: newDescription.trim(), position },
      {
        onSuccess: () => {
          setNewName('');
          setNewDescription('');
          setShowAddForm(false);
        },
      }
    );
  };

  const handleEdit = (treat: SweetTreat) => {
    setEditingId(treat.id);
    setEditName(treat.name);
    setEditDescription(treat.description);
  };

  const handleSaveEdit = (treat: SweetTreat) => {
    if (!editName.trim()) return;
    updateMutation.mutate(
      { id: treat.id, name: editName.trim(), description: editDescription.trim(), position: treat.position },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditName('');
          setEditDescription('');
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this sweet treat?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedTreats];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    reorderMutation.mutate(newOrder.map(t => t.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedTreats.length - 1) return;
    const newOrder = [...sortedTreats];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderMutation.mutate(newOrder.map(t => t.id));
  };

  return (
    <div className="space-y-4">
      {!showAddForm ? (
        <Button onClick={() => setShowAddForm(true)} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Sweet Treat
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Sweet Treat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Treat name (e.g., Cupcake, Kiss, Bouquet)"
            />
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                disabled={addMutation.isPending || !newName.trim()}
                className="flex-1"
              >
                {addMutation.isPending ? 'Adding...' : 'Add Treat'}
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
      ) : sortedTreats.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No sweet treats yet. Add your first treat above!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTreats.map((treat, index) => (
            <Card key={treat.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Treat {index + 1}</span>
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
                      disabled={index === sortedTreats.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editingId === treat.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Treat name"
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(treat)}
                        disabled={updateMutation.isPending || !editName.trim()}
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
                    <div>
                      <p className="font-semibold">{treat.name}</p>
                      {treat.description && (
                        <p className="text-sm text-muted-foreground mt-1">{treat.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(treat)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(treat.id)}
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
