import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

interface HeartClickMiniGameProps {
  onWin: () => void;
  resetTrigger?: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export default function HeartClickMiniGame({ onWin, resetTrigger = 0 }: HeartClickMiniGameProps) {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const winCalledRef = useRef(false);
  const gameActiveRef = useRef(true);

  useEffect(() => {
    initializeGame();
  }, [resetTrigger]);

  const initializeGame = () => {
    setScore(0);
    setTimeLeft(15);
    winCalledRef.current = false;
    gameActiveRef.current = true;
    
    const initialHearts: FloatingHeart[] = [];
    for (let i = 0; i < 5; i++) {
      initialHearts.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        speed: Math.random() * 2 + 1,
      });
    }
    setHearts(initialHearts);
  };

  useEffect(() => {
    if (!gameActiveRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          gameActiveRef.current = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetTrigger]);

  useEffect(() => {
    if (!gameActiveRef.current) return;

    const moveInterval = setInterval(() => {
      setHearts((prevHearts) =>
        prevHearts.map((heart) => ({
          ...heart,
          y: (heart.y + heart.speed) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [resetTrigger]);

  useEffect(() => {
    if (score >= 15 && !winCalledRef.current && gameActiveRef.current) {
      winCalledRef.current = true;
      gameActiveRef.current = false;
      setTimeout(() => onWin(), 300);
    }
  }, [score, onWin]);

  const handleHeartClick = (id: number) => {
    if (!gameActiveRef.current) return;
    
    setScore((prev) => prev + 1);
    setHearts((prevHearts) =>
      prevHearts.map((heart) =>
        heart.id === id
          ? { ...heart, x: Math.random() * 80 + 10, y: Math.random() * 20 }
          : heart
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-center">
        <p className="text-sm text-muted-foreground">Score: {score} / 15</p>
        <p className="text-sm text-muted-foreground">Time: {timeLeft}s</p>
      </div>

      <div className="relative w-full h-96 bg-gradient-to-b from-primary/5 to-accent/5 rounded-lg overflow-hidden border-2 border-primary/20">
        {hearts.map((heart) => (
          <button
            key={heart.id}
            onClick={() => handleHeartClick(heart.id)}
            className="absolute transition-all duration-100 hover:scale-125 cursor-pointer"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
          </button>
        ))}
        {timeLeft === 0 && score < 15 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white text-xl font-bold">Time's up! Try again!</p>
          </div>
        )}
      </div>
    </div>
  );
}
