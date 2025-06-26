import { Route, Routes, Link } from "react-router-dom";
import { Navbar } from "./components/Forms/Navbar";
import { NoMatch } from "./components/NoMatch";
import { MatchsDetails } from "./components/Matchs/MatchsDetails";
import { SearchBar } from "./components/Forms/Searchbar";
import { TeamsDetails } from "./components/Teams/TeamsDetails";
import { RegisterModal } from "./components/RegisterModal/RegisterModal";
import { Footer } from "./components/Footer/Footer";
import { Live } from "./components/LiveMatch/Live";
import { Competitions } from "./components/Competitions/Competitions";
import { CompetitionsDetails } from "./components/Competitions/CompetitionsDetails";
import { LoginModal } from "./components/LoginModal/LoginModal";
import { SelectFavoriteTeam } from "./components/Selector/SelectFavoriteTeam";

function App() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="h-20 w-full sticky top-0 z-50 bg-neutral-950 shadow-lg shadow-amber-900/50 px-0 sm:px-4">
        <div className="w-full mx-auto flex items-center justify-between h-full px-4">
          {/* Logo à gauche */}
          <Link to="/" className="text-3xl font-bold text-white ml-0 sm:ml-4">
            Match Master
          </Link>

          {/* Navbar centrée */}
          <div className="flex-1 flex justify-center">
            <Navbar />
          </div>

          {/* Barre de recherche à droite (cachée en mobile) */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>
        </div>
      </header>

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
        </Routes>
      </main>

      <Footer />
      </div>

    </div>
  );
}

export default App;