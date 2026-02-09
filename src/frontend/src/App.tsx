import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useAuthz';
import ValentineLayout from './components/valentine/ValentineLayout';
import IntroSection from './components/valentine/sections/IntroSection';
import PhotosSection from './components/valentine/sections/PhotosSection';
import MessagesSection from './components/valentine/sections/MessagesSection';
import TreatsSection from './components/valentine/sections/TreatsSection';
import GameSection from './components/valentine/sections/GameSection';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import OwnerEditorPanel from './components/owner/OwnerEditorPanel';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [activeSection, setActiveSection] = useState('intro');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'photos', 'messages', 'treats', 'game'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ValentineLayout activeSection={activeSection}>
        <div className="fixed top-4 right-4 z-50">
          <LoginButton />
        </div>

        <IntroSection />
        <PhotosSection />
        <MessagesSection />
        <TreatsSection />
        <GameSection />

        {isAuthenticated && <OwnerEditorPanel />}
        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </ValentineLayout>
    </ThemeProvider>
  );
}
