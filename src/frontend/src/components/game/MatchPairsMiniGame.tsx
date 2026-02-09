import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Sparkles, Gift, Cake } from 'lucide-react';

interface MatchPairsMiniGameProps {
  onWin: () => void;
  resetTrigger?: number;
}

type CardType = {
  id: number;
  icon: 'heart' | 'sparkles' | 'gift' | 'cake';
  isFlipped: boolean;
  isMatched: boolean;
};

const ICONS = ['heart', 'sparkles', 'gift', 'cake'] as const;

export default function MatchPairsMiniGame({ onWin, resetTrigger = 0 }: MatchPairsMiniGameProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const winCalledRef = useRef(false);

  useEffect(() => {
    initializeGame();
  }, [resetTrigger]);

  const initializeGame = () => {
    const cardPairs: CardType[] = [];
    ICONS.forEach((icon, idx) => {
      cardPairs.push(
        { id: idx * 2, icon, isFlipped: false, isMatched: false },
        { id: idx * 2 + 1, icon, isFlipped: false, isMatched: false }
      );
    });

    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setIsChecking(false);
    setMoves(0);
    winCalledRef.current = false;
  };

  const handleCardClick = (index: number) => {
    if (
      isChecking ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsChecking(false);

          if (matchedCards.every(card => card.isMatched) && !winCalledRef.current) {
            winCalledRef.current = true;
            setTimeout(() => onWin(), 300);
          }
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const renderIcon = (icon: CardType['icon']) => {
    const iconClass = "w-12 h-12";
    switch (icon) {
      case 'heart':
        return <Heart className={`${iconClass} text-primary fill-primary`} />;
      case 'sparkles':
        return <Sparkles className={`${iconClass} text-accent`} />;
      case 'gift':
        return <Gift className={`${iconClass} text-secondary-foreground`} />;
      case 'cake':
        return <Cake className={`${iconClass} text-destructive`} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Moves: {moves}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={isChecking || card.isFlipped || card.isMatched}
            className="aspect-square relative group"
          >
            <Card
              className={`w-full h-full flex items-center justify-center transition-all duration-300 transform cursor-pointer
                ${card.isFlipped || card.isMatched ? 'bg-card' : 'bg-primary/10 hover:bg-primary/20'}
                ${card.isMatched ? 'opacity-60 scale-95' : 'hover:scale-105'}
                ${!card.isFlipped && !card.isMatched ? 'shadow-md' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="animate-in zoom-in duration-300">
                  {renderIcon(card.icon)}
                </div>
              ) : (
                <Heart className="w-8 h-8 text-primary/30" />
              )}
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
