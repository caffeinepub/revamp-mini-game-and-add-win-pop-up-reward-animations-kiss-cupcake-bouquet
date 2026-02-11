import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface WinLoveMessagePopupProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const LOVE_MESSAGES = [
  "You're absolutely amazing! 💕",
  "My heart skips a beat for you! 💖",
  "You light up my world! ✨",
  "Forever grateful for you! 🌹",
  "You make everything better! 💝",
  "You're my favorite person! 🥰",
  "Love you to the moon and back! 🌙",
  "You're simply the best! 💗",
  "My heart belongs to you! 💘",
  "You're my everything! 🌟",
];

export default function WinLoveMessagePopup({ isVisible, onDismiss }: WinLoveMessagePopupProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isVisible) {
      // Pick a random love message
      const randomMessage = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
      setMessage(randomMessage);

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="love-message-popup bg-primary/95 text-primary-foreground px-8 py-6 rounded-3xl shadow-2xl max-w-md mx-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Heart className="w-8 h-8 fill-current animate-pulse" />
          <Heart className="w-10 h-10 fill-current animate-pulse" style={{ animationDelay: '0.2s' }} />
          <Heart className="w-8 h-8 fill-current animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="text-2xl sm:text-3xl font-bold leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
