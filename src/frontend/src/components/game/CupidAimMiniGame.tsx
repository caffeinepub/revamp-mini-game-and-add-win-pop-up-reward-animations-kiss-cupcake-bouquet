import { useState, useEffect, useRef } from 'react';
import { Target, Heart } from 'lucide-react';

interface CupidAimMiniGameProps {
  onWin: () => void;
  resetTrigger?: number;
}

interface TargetPosition {
  x: number;
  y: number;
}

export default function CupidAimMiniGame({ onWin, resetTrigger = 0 }: CupidAimMiniGameProps) {
  const [target, setTarget] = useState<TargetPosition>({ x: 50, y: 50 });
  const [hits, setHits] = useState(0);
  const [showHit, setShowHit] = useState(false);
  const winCalledRef = useRef(false);

  useEffect(() => {
    initializeGame();
  }, [resetTrigger]);

  const initializeGame = () => {
    setHits(0);
    winCalledRef.current = false;
    moveTarget();
  };

  const moveTarget = () => {
    setTarget({
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
    });
  };

  const handleTargetClick = () => {
    const newHits = hits + 1;
    setHits(newHits);
    setShowHit(true);

    setTimeout(() => setShowHit(false), 300);

    if (newHits >= 10 && !winCalledRef.current) {
      winCalledRef.current = true;
      setTimeout(() => onWin(), 500);
    } else {
      moveTarget();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Hits: {hits} / 10</p>
      </div>

      <div className="relative w-full h-96 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 rounded-lg overflow-hidden border-2 border-primary/20">
        <button
          onClick={handleTargetClick}
          className="absolute transition-all duration-300 hover:scale-110 cursor-crosshair"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            <Target className="w-16 h-16 text-primary animate-pulse" />
            <Heart className="w-6 h-6 text-primary fill-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </button>

        {showHit && (
          <div
            className="absolute text-2xl font-bold text-primary animate-ping"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            ❤️
          </div>
        )}
      </div>
    </div>
  );
}
