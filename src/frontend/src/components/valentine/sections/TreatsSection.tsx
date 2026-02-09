import { useGetUnlockedTreats } from '@/hooks/useUnlockedContent';
import { useGetAllTreats } from '@/hooks/useTreats';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Cake, Lock } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useAuthz';

const TREAT_EMOJIS = ['🧁', '💝', '🍫', '🍰', '🍬'];

export default function TreatsSection() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: unlockedTreats = [], isLoading: unlockedLoading } = useGetUnlockedTreats();
  const { data: adminTreats = [], isLoading: adminLoading } = useGetAllTreats();

  const isAuthenticated = !!identity;
  
  // Admin sees all treats, regular users see unlocked treats, guests see nothing
  const isLoading = isAdmin ? adminLoading : unlockedLoading;
  const treats = isAdmin ? adminTreats : unlockedTreats;

  const sortedTreats = [...treats].sort((a, b) => Number(a.position) - Number(b.position));
  const totalSlots = 5;
  const lockedCount = Math.max(0, totalSlots - sortedTreats.length);

  return (
    <section id="treats" className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Sweet Treats
          </h2>
          <p className="text-lg text-muted-foreground">
            {isAuthenticated && !isAdmin ? 'Win games to unlock more treats' : 'Delicious surprises just for you'}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedTreats.length === 0 ? (
          <Card className="p-12 text-center">
            <Cake className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Treats Yet</h3>
            <p className="text-muted-foreground">
              {isAdmin ? 'Add sweet treats using the settings panel' : 'Sweet treats will appear here once unlocked'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTreats.map((treat, index) => (
              <Card
                key={treat.id}
                className="heart-shadow hover:shadow-xl transition-all hover:scale-105"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-6xl">{TREAT_EMOJIS[index % TREAT_EMOJIS.length]}</div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{treat.name}</h3>
                    <p className="text-sm text-muted-foreground">{treat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {isAuthenticated && !isAdmin && Array.from({ length: lockedCount }).map((_, index) => (
              <Card
                key={`locked-${index}`}
                className="opacity-60"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Locked Treat</h3>
                    <p className="text-sm text-muted-foreground">
                      Win a game to unlock this sweet surprise
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
