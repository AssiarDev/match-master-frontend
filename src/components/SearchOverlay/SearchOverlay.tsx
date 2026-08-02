import { useEffect, useRef, useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useTeams } from "../../hooks/useTeams";
import type { SearchSection } from "./searchTypes";

interface SearchOverlayProps {
  onClose: () => void;
}

/** Full-screen mobile search overlay — extensible by adding sections. */
export const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const { competitions } = useCompetitions();
  const { teams } = useTeams(competitions);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredCompetitions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return competitions.filter((c) => c.name.toLowerCase().includes(q));
  }, [query, competitions]);

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return teams.filter((t) => t.name.toLowerCase().includes(q));
  }, [query, teams]);

  const sections: SearchSection[] = useMemo(
    () => [
      {
        label: "Compétitions",
        results: filteredCompetitions.map((c) => ({
          id: c.id,
          name: c.name,
          image: c.image_path,
          route: `/competition/${c.id}`,
          state: { competition: c },
        })),
      },
      {
        label: "Équipes",
        results: filteredTeams.map((t) => ({
          id: t.id,
          name: t.name,
          image: t.image,
          route: `/teams/${t.id}`,
          state: { selectedLeague: t.leagueId },
        })),
      },
    ],
    [filteredCompetitions, filteredTeams],
  );

  const hasResults = sections.some((s) => s.results.length > 0);

  const handleClick = (route: string, state?: Record<string, unknown>) => {
    navigate(route, { state });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col md:hidden">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-700">
        <FiSearch size={20} className="text-zinc-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          placeholder="Rechercher une équipe ou une compétition..."
          className="flex-1 bg-transparent text-zinc-100 text-lg outline-none placeholder:text-zinc-500"
        />
        <button
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
        >
          <FiX size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!query.trim() && (
          <p className="text-zinc-500 text-sm text-center mt-16">
            Tapez le nom d'une équipe ou d'une compétition
          </p>
        )}

        {query.trim() && !hasResults && (
          <p className="text-zinc-500 text-sm text-center mt-16">
            Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
          </p>
        )}

        {sections
          .filter((s) => s.results.length > 0)
          .map((section) => (
            <section key={section.label}>
              <p className="px-4 pt-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {section.label}
              </p>
              <ul>
                {section.results.map((result) => (
                  <li
                    key={result.id}
                    onClick={() => handleClick(result.route, result.state)}
                    className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 active:bg-zinc-800 cursor-pointer"
                  >
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-zinc-100">{result.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
};
