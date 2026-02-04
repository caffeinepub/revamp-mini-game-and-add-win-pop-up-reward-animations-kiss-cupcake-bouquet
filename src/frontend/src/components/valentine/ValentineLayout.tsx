import { ReactNode } from 'react';
import SectionNav from './SectionNav';
import { Heart } from 'lucide-react';

interface ValentineLayoutProps {
  children: ReactNode;
  activeSection: string;
}

export default function ValentineLayout({ children, activeSection }: ValentineLayoutProps) {
  return (
    <div className="min-h-screen valentine-gradient dark:valentine-gradient-dark smooth-scroll">
      <SectionNav activeSection={activeSection} />
      
      <main className="relative">
        {children}
      </main>

      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <p className="flex items-center justify-center gap-2">
          © 2026. Built with <Heart className="w-4 h-4 fill-primary text-primary" /> using{' '}
          <a 
            href="https://caffeine.ai" 
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
