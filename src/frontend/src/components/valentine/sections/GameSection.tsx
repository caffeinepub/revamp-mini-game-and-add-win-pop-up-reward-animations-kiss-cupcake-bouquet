import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import RewardsModal from '@/components/game/RewardsModal';
import MatchPairsMiniGame from '@/components/game/MatchPairsMiniGame';
import WinPopups from '@/components/game/WinPopups';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function GameSection() {
  const { hasWon, markAsWon, resetGame } = useGameProgress();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [showRewards, setShowRewards] = useState(false);
  const [showPopups, setShowPopups] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    if (hasWon) {
      setGameState('won');
    }
  }, [hasWon]);

  const startGame = () => {
    setGameState('playing');
    setShowPopups(false);
    setResetTrigger(prev => prev + 1);
  };

  const handleWin = () => {
    setGameState('won');
    markAsWon();
    setShowPopups(true);
    // Auto-show rewards after a brief delay
    setTimeout(() => {
      setShowRewards(true);
    }, 1500);
  };

  const handlePlayAgain = () => {
    setGameState('idle');
    setShowRewards(false);
    setShowPopups(false);
    // Note: We don't call resetGame() here to preserve the session "won" state
    // This allows the user to replay without losing their achievement
  };

  return (
    <section id="game" className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Love Match Game
          </h2>
          <p className="text-lg text-muted-foreground">
            Find all the matching pairs to unlock a special surprise
          </p>
        </div>

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
                  {gameState === 'playing' ? 'Match the Pairs' : 'Ready to Play?'}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === 'idle' && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Flip the cards to find matching pairs. Match all 4 pairs to win!
                </p>
                <Button size="lg" onClick={startGame} className="rounded-full px-8">
                  Start Game
                </Button>
              </div>
            )}

            {gameState === 'playing' && (
              <MatchPairsMiniGame onWin={handleWin} resetTrigger={resetTrigger} />
            )}

            {gameState === 'won' && (
              <div className="text-center space-y-4">
                <p className="text-lg">
                  Amazing! You've unlocked your special rewards!
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="lg" onClick={() => setShowRewards(true)} className="rounded-full">
                    View Rewards
                  </Button>
                  <Button size="lg" variant="outline" onClick={handlePlayAgain} className="rounded-full">
                    Play Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <WinPopups isActive={showPopups} />

      <RewardsModal
        open={showRewards}
        onClose={() => setShowRewards(false)}
        onPlayAgain={handlePlayAgain}
      />
    </section>
  );
}
