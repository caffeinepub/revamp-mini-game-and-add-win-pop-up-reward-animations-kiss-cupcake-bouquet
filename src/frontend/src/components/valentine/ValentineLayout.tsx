import { ReactNode } from 'react';
import { Heart } from 'lucide-react';

interface ValentineLayoutProps {
  children: ReactNode;
}

export default function ValentineLayout({ children }: ValentineLayoutProps) {
  return (
    <div className="min-h-screen valentine-gradient dark:valentine-gradient-dark smooth-scroll">
      <main className="relative">
        {children}
      </main>

      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <p className="flex items-center justify-center gap-2">
          © {new Date().getFullYear()}. Built with <Heart className="w-4 h-4 fill-primary text-primary" /> using{' '}
          <a 
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
