import { Route, Routes, Link } from "react-router-dom";
import { Navbar } from "@/components/Forms/Navbar";
import { NoMatch } from "@/components/NoMatch";
import { Home } from "@/components/Home/Home";
import { MatchsDetails } from "@/components/Matchs/Matchs";
import { SearchBar } from "@/components/Forms/Searchbar";
import { TeamsDetails } from "@/components/Teams/TeamsDetails";
import { RegisterModal } from "@/components/RegisterModal/RegisterModal";
import { Footer } from "@/components/Footer/Footer";
import { Live } from "@/components/LiveMatch/Live";
import { Competitions } from "@/components/Competitions/Competitions";
import { CompetitionsDetails } from "@/components/Competitions/CompetitionsDetails";
import { LoginModal } from "@/components/LoginModal/LoginModal";


function App() {

  return (
      <div className="flex flex-col min-h-screen">  
        <header className="h-20 w-full sticky top-0 z-50 left-0 bg-neutral-950 border-none shadow-lg shadow-amber-900/50 flex items-center justify-between">
          <Link to="/"  className="font-sans text-4xl font-bold text-white mx-2">Match Master</Link>
          <Navbar />
          <SearchBar />
        </header>
        <div className="mt-10 flex-grow">
          <Routes>
              <Route path="/login" element={<LoginModal />} />
              <Route path="/register" element={<RegisterModal />} />
              <Route path="*" element={<NoMatch />}/>
              <Route path="/" element={<MatchsDetails />}/>
              <Route path="/teams/:teamId" element={<TeamsDetails />} />
              <Route path="/favoris" element={<Home />} />
              <Route path="/live" element={<Live />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/competition/:competitionId" element={<CompetitionsDetails />}/>
          </Routes>
        </div>
        <Footer /> 
      </div>
  )
}

export default App