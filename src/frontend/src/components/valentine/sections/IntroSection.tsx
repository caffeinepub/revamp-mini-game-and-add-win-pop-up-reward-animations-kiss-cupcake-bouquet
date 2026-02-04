import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IntroSection() {
  const scrollToPhotos = () => {
    const element = document.getElementById('photos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="intro" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Happy Valentine's Day
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold text-foreground leading-tight">
          A Special Place
          <br />
          <span className="text-primary">Just For You</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Welcome to our little corner of the internet. I've created this space to celebrate us,
          filled with memories, messages, and a fun surprise waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={scrollToPhotos}
            className="rounded-full px-8 gap-2 text-lg heart-shadow"
          >
            <Heart className="w-5 h-5 fill-current" />
            Explore Our Memories
          </Button>
        </div>

        <div className="pt-12 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full mx-auto flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
