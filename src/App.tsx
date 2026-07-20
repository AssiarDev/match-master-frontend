import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { NoMatch } from "./components/NoMatch/NoMatch";
import { MatchsDetails } from "./components/Matchs/MatchsDetails";
import { TeamsDetails } from "./components/Teams/TeamsDetails";
import { RegisterModal } from "./components/Forms/RegisterModal/RegisterModal";
import { Footer } from "./components/Footer/Footer";
import { Live } from "./components/LiveMatch/Live";
import { Competitions } from "./components/Competitions/Competitions";
import { CompetitionsDetails } from "./components/Competitions/CompetitionsDetails";
import { LoginModal } from "./components/Forms/LoginModal/LoginModal";
import { FavoriteModal } from "./components/Favorite/FavoriteModal/FavoriteModal";
import { Header } from "./components/Header/Header";
import { MobileMenu } from "./components/MobileMenu/MobileMenu";
import { UserProfile } from "./components/Profile/UserProfile";
import { PrivacyPolicy } from "./components/Legal/PrivacyPolicy";
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
              <Route path="/login" element={<LoginModal />} />
              <Route path="/register" element={<RegisterModal />} />
              <Route path="*" element={<NoMatch />} />
              <Route path="/" element={<MatchsDetails />} />
              <Route path="/teams/:teamId" element={<TeamsDetails />} />
              <Route path="/live" element={<Live />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route
                path="/competition/:competitionId"
                element={<CompetitionsDetails />}
              />
              <Route element={<PrivateRoute />}>
                <Route path="/favoriteUser" element={<FavoriteModal />} />
                <Route path="/user-profile" element={<UserProfile />} />
              </Route>
              <Route path="/privacy" element={<PrivacyPolicy />} />
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
