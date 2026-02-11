import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useAuthz';
import ValentineLayout from './components/valentine/ValentineLayout';
import GameSection from './components/valentine/sections/GameSection';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import OwnerEditorPanel from './components/owner/OwnerEditorPanel';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ValentineLayout>
        <div className="fixed top-4 right-4 z-50">
          <LoginButton />
        </div>

        <GameSection />

        {isAuthenticated && <OwnerEditorPanel />}
        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </ValentineLayout>
    </ThemeProvider>
  );
}
