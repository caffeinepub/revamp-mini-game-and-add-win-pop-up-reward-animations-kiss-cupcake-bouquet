import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SweetSortMiniGameProps {
  onWin: () => void;
  resetTrigger?: number;
}

type SweetColor = 'pink' | 'red' | 'purple';

interface Sweet {
  id: number;
  color: SweetColor;
}

const COLOR_CLASSES = {
  pink: 'bg-pink-400',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

export default function SweetSortMiniGame({ onWin, resetTrigger = 0 }: SweetSortMiniGameProps) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [selectedColor, setSelectedColor] = useState<SweetColor | null>(null);
  const [sortedSweets, setSortedSweets] = useState<{ [key in SweetColor]: Sweet[] }>({
    pink: [],
    red: [],
    purple: [],
  });
  const winCalledRef = useRef(false);

  useEffect(() => {
    initializeGame();
  }, [resetTrigger]);

  const initializeGame = () => {
    const colors: SweetColor[] = ['pink', 'red', 'purple'];
    const newSweets: Sweet[] = [];
    
    colors.forEach((color) => {
      for (let i = 0; i < 4; i++) {
        newSweets.push({ id: Math.random(), color });
      }
    });

    setSweets(newSweets.sort(() => Math.random() - 0.5));
    setSortedSweets({ pink: [], red: [], purple: [] });
    setSelectedColor(null);
    winCalledRef.current = false;
  };

  const handleSweetClick = (sweet: Sweet) => {
    if (selectedColor) {
      const newSortedSweets = { ...sortedSweets };
      newSortedSweets[selectedColor].push(sweet);
      setSortedSweets(newSortedSweets);
      setSweets(sweets.filter((s) => s.id !== sweet.id));

      const allSorted = Object.values(newSortedSweets).every((arr) => arr.length === 4);
      const correctlySorted = Object.entries(newSortedSweets).every(
        ([color, arr]) => arr.every((s) => s.color === color)
      );

      if (allSorted && correctlySorted && !winCalledRef.current) {
        winCalledRef.current = true;
        setTimeout(() => onWin(), 500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Select a color, then click sweets to sort them
        </p>
        <div className="flex gap-3 justify-center">
          {(['pink', 'red', 'purple'] as SweetColor[]).map((color) => (
            <Button
              key={color}
              onClick={() => setSelectedColor(color)}
              variant={selectedColor === color ? 'default' : 'outline'}
              className="capitalize"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="min-h-24 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-border">
          <p className="text-xs text-muted-foreground mb-2">Unsorted Sweets:</p>
          <div className="flex flex-wrap gap-2">
            {sweets.map((sweet) => (
              <button
                key={sweet.id}
                onClick={() => handleSweetClick(sweet)}
                disabled={!selectedColor}
                className={`w-12 h-12 rounded-full ${COLOR_CLASSES[sweet.color]} hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(['pink', 'red', 'purple'] as SweetColor[]).map((color) => (
            <Card key={color} className="p-3">
              <p className="text-xs font-semibold capitalize mb-2 text-center">{color}</p>
              <div className="flex flex-wrap gap-2 min-h-16 justify-center">
                {sortedSweets[color].map((sweet) => (
                  <div
                    key={sweet.id}
                    className={`w-10 h-10 rounded-full ${COLOR_CLASSES[sweet.color]} shadow-md`}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
