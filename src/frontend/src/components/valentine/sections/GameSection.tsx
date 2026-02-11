import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Lock, Trophy } from 'lucide-react';
import RewardsModal from '@/components/game/RewardsModal';
import MatchPairsMiniGame from '@/components/game/MatchPairsMiniGame';
import HeartClickMiniGame from '@/components/game/HeartClickMiniGame';
import LoveWordMiniGame from '@/components/game/LoveWordMiniGame';
import CupidAimMiniGame from '@/components/game/CupidAimMiniGame';
import SweetSortMiniGame from '@/components/game/SweetSortMiniGame';
import WinPopups from '@/components/game/WinPopups';
import WinLoveMessagePopup from '@/components/game/WinLoveMessagePopup';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useIncrementUnlocks } from '@/hooks/useUnlocks';
import { useGetUnlockedPictures, useGetUnlockedMessages, useGetUnlockedTreats } from '@/hooks/useUnlockedContent';
import { useGetPictures } from '@/hooks/usePictures';
import { useGetMessages } from '@/hooks/useMessages';
import { useGetAllTreats } from '@/hooks/useTreats';
import { useIsCallerAdmin } from '@/hooks/useAuthz';

type GameId = 'match-pairs' | 'heart-click' | 'love-word' | 'cupid-aim' | 'sweet-sort';

interface MiniGame {
  id: GameId;
  title: string;
  description: string;
  icon: typeof Heart;
}

const MINI_GAMES: MiniGame[] = [
  { id: 'match-pairs', title: 'Match Pairs', description: 'Find all matching pairs', icon: Heart },
  { id: 'heart-click', title: 'Heart Catcher', description: 'Catch the floating hearts', icon: Heart },
  { id: 'love-word', title: 'Love Words', description: 'Unscramble the love word', icon: Sparkles },
  { id: 'cupid-aim', title: "Cupid's Arrow", description: 'Hit the target with love', icon: Heart },
  { id: 'sweet-sort', title: 'Sweet Sort', description: 'Sort the treats by color', icon: Heart },
];

export default function GameSection() {
  const { completedGames, totalCompleted, markGameComplete, isGameComplete } = useGameProgress();
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [showRewards, setShowRewards] = useState(false);
  const [showPopups, setShowPopups] = useState(false);
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [loveMessageKey, setLoveMessageKey] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [unlockedReward, setUnlockedReward] = useState<{ message: string; photo: string; treat: string } | null>(null);
  const winHandledRef = useRef(false);

  const { data: isAdmin } = useIsCallerAdmin();
  const incrementMutation = useIncrementUnlocks();
  const { data: unlockedPictures = [] } = useGetUnlockedPictures();
  const { data: unlockedMessages = [] } = useGetUnlockedMessages();
  const { data: unlockedTreats = [] } = useGetUnlockedTreats();
  const { data: adminPictures = [] } = useGetPictures();
  const { data: adminMessages = [] } = useGetMessages();
  const { data: adminTreats = [] } = useGetAllTreats();

  // Admin sees all content, regular users see what they have
  const allPictures = isAdmin ? adminPictures : unlockedPictures;
  const allMessages = isAdmin ? adminMessages : unlockedMessages;
  const allTreats = isAdmin ? adminTreats : unlockedTreats;

  const startGame = (gameId: GameId) => {
    setSelectedGame(gameId);
    setGameState('playing');
    setShowPopups(false);
    setShowLoveMessage(false);
    setResetTrigger(prev => prev + 1);
    winHandledRef.current = false;
  };

  const handleWin = async () => {
    if (winHandledRef.current || !selectedGame) return;
    winHandledRef.current = true;

    const alreadyCompleted = isGameComplete(selectedGame);
    
    // Show love message popup for every win
    setLoveMessageKey(prev => prev + 1);
    setShowLoveMessage(true);
    
    if (alreadyCompleted) {
      setGameState('won');
      setShowPopups(true);
      setTimeout(() => {
        setShowRewards(true);
      }, 1500);
      return;
    }

    markGameComplete(selectedGame);
    setGameState('won');
    setShowPopups(true);

    try {
      await incrementMutation.mutateAsync();
      
      const sortedPictures = [...allPictures].sort((a, b) => Number(a.position) - Number(b.position));
      const sortedMessages = [...allMessages].sort((a, b) => Number(a.position) - Number(b.position));
      const sortedTreats = [...allTreats].sort((a, b) => Number(a.position) - Number(b.position));

      const newUnlockedIndex = unlockedPictures.length;
      const newMessage = sortedMessages[newUnlockedIndex]?.content || 'A special message for you! ❤️';
      const newPhoto = sortedPictures[newUnlockedIndex]?.blob.getDirectURL() || '/assets/generated/bouquet.dim_512x512.png';
      const newTreat = sortedTreats[newUnlockedIndex]?.name || 'A Sweet Surprise';

      setUnlockedReward({ message: newMessage, photo: newPhoto, treat: newTreat });

      setTimeout(() => {
        setShowRewards(true);
      }, 1500);
    } catch (error) {
      console.error('Failed to unlock content:', error);
    }
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
    setGameState('idle');
    setShowRewards(false);
    setShowPopups(false);
    setShowLoveMessage(false);
    winHandledRef.current = false;
  };

  const handlePlayAgain = () => {
    setGameState('idle');
    setShowRewards(false);
    setShowPopups(false);
    setShowLoveMessage(false);
    winHandledRef.current = false;
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    switch (selectedGame) {
      case 'match-pairs':
        return <MatchPairsMiniGame onWin={handleWin} resetTrigger={resetTrigger} />;
      case 'heart-click':
        return <HeartClickMiniGame onWin={handleWin} resetTrigger={resetTrigger} />;
      case 'love-word':
        return <LoveWordMiniGame onWin={handleWin} resetTrigger={resetTrigger} />;
      case 'cupid-aim':
        return <CupidAimMiniGame onWin={handleWin} resetTrigger={resetTrigger} />;
      case 'sweet-sort':
        return <SweetSortMiniGame onWin={handleWin} resetTrigger={resetTrigger} />;
      default:
        return null;
    }
  };

  return (
    <section id="game" className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Love Games
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Win each game to unlock special surprises
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">{totalCompleted} / 5 Games Completed</span>
          </div>
        </div>

        {!selectedGame ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MINI_GAMES.map((game) => {
              const completed = isGameComplete(game.id);
              return (
                <Card
                  key={game.id}
                  className={`heart-shadow cursor-pointer transition-all hover:scale-105 ${
                    completed ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => startGame(game.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <game.icon className={`w-5 h-5 ${completed ? 'text-primary fill-primary' : ''}`} />
                        {game.title}
                      </span>
                      {completed ? (
                        <Sparkles className="w-5 h-5 text-primary" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    {completed && (
                      <p className="text-xs text-primary mt-2 font-semibold">✓ Completed</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="heart-shadow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                {gameState === 'won' ? (
                  <>
                    <Sparkles className="w-6 h-6 text-primary" />
                    You Won!
                    <Sparkles className="w-6 h-6 text-primary" />
                  </>
                ) : (
                  <>
                    <Heart className="w-6 h-6 text-primary fill-primary" />
                    {MINI_GAMES.find(g => g.id === selectedGame)?.title}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {gameState === 'playing' && renderGameComponent()}

              {gameState === 'won' && (
                <div className="text-center space-y-4">
                  <p className="text-lg">
                    Amazing! {isGameComplete(selectedGame) && completedGames.filter(g => g === selectedGame).length > 1 
                      ? "You've already unlocked this reward, but you can play again!"
                      : "You've unlocked your special rewards!"}
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button size="lg" onClick={() => setShowRewards(true)} className="rounded-full">
                      View Rewards
                    </Button>
                    <Button size="lg" variant="outline" onClick={handlePlayAgain} className="rounded-full">
                      Play Again
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleBackToMenu} className="rounded-full">
                      Back to Menu
                    </Button>
                  </div>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="text-center">
                  <Button variant="ghost" onClick={handleBackToMenu}>
                    Back to Menu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <WinPopups isActive={showPopups} />
      
      <WinLoveMessagePopup 
        key={loveMessageKey}
        isVisible={showLoveMessage} 
        onDismiss={() => setShowLoveMessage(false)} 
      />

      <RewardsModal
        open={showRewards}
        onClose={() => setShowRewards(false)}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
        reward={unlockedReward}
      />
    </section>
  );
}
