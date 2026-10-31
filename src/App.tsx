import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { HomePage } from "@/pages/HomePage";
import { TeamPage } from "@/pages/TeamPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { Footer } from "./components/Footer/Footer";
import { LivePage } from "@/pages/LivePage";
import { CompetitionsPage } from "@/pages/CompetitionsPage";
import { CompetitionPage } from "@/pages/CompetitionPage";
import { LoginPage } from "@/pages/LoginPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { Header } from "./components/Header/Header";
import { MobileMenu } from "./components/MobileMenu/MobileMenu";
import { ProfilePage } from "@/pages/ProfilePage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { CookieBanner } from "./components/CookieBanner/CookieBanner";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { BottomNav } from "./components/BottomNav/BottomNav";
import { SearchOverlay } from "./components/SearchOverlay/SearchOverlay";
import { LiveStreamProvider } from "./context/LiveStreamContext";

function App() {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <LiveStreamProvider>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header isMobileMenu={isMobileMenu} setIsMobileMenu={setIsMobileMenu} />
        <MobileMenu
          isOpen={isMobileMenu}
          onClose={() => setIsMobileMenu(false)}
        />
        {isSearchOpen && (
          <SearchOverlay onClose={() => setIsSearchOpen(false)} />
        )}
        <div className="flex flex-col flex-grow pb-16 md:pb-0">
          <main className="flex flex-grow overflow-y-auto">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/teams/:teamId" element={<TeamPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/competitions" element={<CompetitionsPage />} />
              <Route
                path="/competition/:competitionId"
                element={<CompetitionPage />}
              />
              <Route element={<PrivateRoute />}>
                <Route path="/favoriteUser" element={<FavoritesPage />} />
                <Route path="/user-profile" element={<ProfilePage />} />
              </Route>
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
        </div>
        <BottomNav
          onSearchToggle={() => setIsSearchOpen((prev) => !prev)}
          isSearchOpen={isSearchOpen}
        />
      </div>
    </LiveStreamProvider>
  );
}

export default App;
