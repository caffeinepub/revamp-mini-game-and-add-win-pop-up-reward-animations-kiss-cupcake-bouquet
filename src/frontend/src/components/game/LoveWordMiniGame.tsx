import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface LoveWordMiniGameProps {
  onWin: () => void;
  resetTrigger?: number;
}

const LOVE_WORDS = [
  { word: 'FOREVER', scrambled: 'REVROFE' },
  { word: 'ROMANCE', scrambled: 'CEMONAR' },
  { word: 'PASSION', scrambled: 'SIONPAS' },
  { word: 'SWEETHEART', scrambled: 'THEARTSWEE' },
  { word: 'BELOVED', scrambled: 'VEDELOB' },
];

export default function LoveWordMiniGame({ onWin, resetTrigger = 0 }: LoveWordMiniGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const winCalledRef = useRef(false);

  useEffect(() => {
    initializeGame();
  }, [resetTrigger]);

  const initializeGame = () => {
    setCurrentWordIndex(0);
    setSelectedLetters([]);
    setSolvedCount(0);
    winCalledRef.current = false;
    setAvailableLetters(LOVE_WORDS[0].scrambled.split(''));
  };

  useEffect(() => {
    if (currentWordIndex < LOVE_WORDS.length) {
      setAvailableLetters(LOVE_WORDS[currentWordIndex].scrambled.split(''));
      setSelectedLetters([]);
    }
  }, [currentWordIndex]);

  const handleLetterClick = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter]);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index: number) => {
    const letter = selectedLetters[index];
    setAvailableLetters([...availableLetters, letter]);
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const guess = selectedLetters.join('');
    const correct = LOVE_WORDS[currentWordIndex].word;

    if (guess === correct) {
      const newSolvedCount = solvedCount + 1;
      setSolvedCount(newSolvedCount);

      if (newSolvedCount >= 3 && !winCalledRef.current) {
        winCalledRef.current = true;
        setTimeout(() => onWin(), 500);
      } else if (currentWordIndex < LOVE_WORDS.length - 1) {
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1);
        }, 500);
      }
    } else {
      setAvailableLetters(LOVE_WORDS[currentWordIndex].scrambled.split(''));
      setSelectedLetters([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Unscramble the love word!</p>
        <p className="text-lg font-semibold text-primary">Words Solved: {solvedCount} / 3</p>
      </div>

      <div className="space-y-4">
        <div className="min-h-16 flex flex-wrap gap-2 justify-center items-center p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          {selectedLetters.length === 0 ? (
            <p className="text-muted-foreground text-sm">Click letters below to spell the word</p>
          ) : (
            selectedLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleRemoveLetter(index)}
                className="w-12 h-12 bg-primary text-primary-foreground rounded-lg font-bold text-xl hover:bg-primary/80 transition-colors"
              >
                {letter}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {availableLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              className="w-12 h-12 bg-card border-2 border-border rounded-lg font-bold text-xl hover:bg-accent hover:border-primary transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={selectedLetters.length === 0}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Check Answer
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAvailableLetters(LOVE_WORDS[currentWordIndex].scrambled.split(''));
              setSelectedLetters([]);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
