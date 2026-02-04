import { Heart, Image, MessageCircle, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionNavProps {
  activeSection: string;
}

export default function SectionNav({ activeSection }: SectionNavProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'intro', label: 'Home', icon: Heart },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'game', label: 'Game', icon: Gamepad2 },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-card/80 backdrop-blur-md border border-border rounded-full px-2 py-2 shadow-lg heart-shadow">
      <div className="flex gap-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeSection === id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => scrollToSection(id)}
            className="rounded-full gap-2"
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
