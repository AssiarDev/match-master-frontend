import { Route, Routes, Link } from "react-router-dom";
import { NoMatch } from "./components/NoMatch";
import { MatchsDetails } from "./components/Matchs/MatchsDetails";
import { TeamsDetails } from "./components/Teams/TeamsDetails";
import { RegisterModal } from "./components/RegisterModal/RegisterModal";
import { Footer } from "./components/Footer/Footer";
import { Live } from "./components/LiveMatch/Live";
import { Competitions } from "./components/Competitions/Competitions";
import { CompetitionsDetails } from "./components/Competitions/CompetitionsDetails";
import { LoginModal } from "./components/LoginModal/LoginModal";
import { SelectFavoriteTeam } from "./components/Selector/SelectFavoriteTeam";
import { FavoriteModal } from "./components/FavoriteModal/FavoriteModal";
import { Header } from "./components/Header/Header";
import { useState } from "react";

function App() {
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header
        isMobileMenu={isMobileMenu}
        setIsMobileMenu={setIsMobileMenu}
      />
      <div className="flex flex-col flex-grow">
        <main className="flex flex-grow overflow-y-auto">
        <Routes>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/" element={<MatchsDetails />} />
          <Route path="/teams/:teamId" element={<TeamsDetails />} />
          <Route path="/favoris" element={<SelectFavoriteTeam />} />
          <Route path="/live" element={<Live />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competition/:competitionId" element={<CompetitionsDetails />} />
          <Route path="/favoriteUser" element={<FavoriteModal />} />
        </Routes>
      </main>

      <Footer />
      </div>

    </div>
  );
}

export default App;