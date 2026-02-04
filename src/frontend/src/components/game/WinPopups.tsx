import { useEffect, useState } from 'react';

interface Popup {
  id: number;
  image: string;
  x: number;
  y: number;
  delay: number;
}

interface WinPopupsProps {
  isActive: boolean;
  onComplete?: () => void;
}

const POPUP_IMAGES = [
  '/assets/generated/kiss.dim_512x512.png',
  '/assets/generated/cupcake.dim_512x512.png',
  '/assets/generated/bouquet.dim_512x512.png',
];

export default function WinPopups({ isActive, onComplete }: WinPopupsProps) {
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate multiple popups with random positions
      const newPopups: Popup[] = [];
      for (let i = 0; i < 12; i++) {
        newPopups.push({
          id: Date.now() + i,
          image: POPUP_IMAGES[i % POPUP_IMAGES.length],
          x: Math.random() * 80 + 10, // 10-90% from left
          y: Math.random() * 60 + 20, // 20-80% from top
          delay: Math.random() * 800,
        });
      }
      setPopups(newPopups);

      // Clear popups after animation completes
      const timer = setTimeout(() => {
        setPopups([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      setPopups([]);
    }
  }, [isActive, onComplete]);

  if (!isActive || popups.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute win-popup"
          style={{
            left: `${popup.x}%`,
            top: `${popup.y}%`,
            animationDelay: `${popup.delay}ms`,
          }}
        >
          <img
            src={popup.image}
            alt="Celebration"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
          />
        </div>
      ))}
    </div>
  );
}
