import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./Input";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useTeams } from "../../hooks/useTeams";
import type { SearchSection } from "../SearchOverlay/searchTypes";

/** Desktop search bar with live filtering for competitions and teams. Hidden on mobile. */
export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { competitions } = useCompetitions();
  const { teams } = useTeams(competitions);
  const navigate = useNavigate();

  const sections: SearchSection[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [
      {
        label: "Compétitions",
        results: competitions
          .filter((c) => c.name.toLowerCase().includes(q))
          .map((c) => ({
            id: c.id,
            name: c.name,
            image: c.image_path,
            route: `/competition/${c.id}`,
            state: { competition: c },
          })),
      },
      {
        label: "Équipes",
        results: teams
          .filter((t) => t.name.toLowerCase().includes(q))
          .map((t) => ({
            id: t.id,
            name: t.name,
            image: t.image,
            route: `/teams/${t.id}`,
            state: { selectedLeague: t.leagueId },
          })),
      },
    ];
  }, [query, competitions, teams]);

  const hasResults = sections.some((s) => s.results.length > 0);

  const handleClick = (route: string, state?: Record<string, unknown>) => {
    navigate(route, { state });
    setQuery("");
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        placeholder="Rechercher..."
      />
      {query.trim() && hasResults && (
        <div className="absolute top-full mt-1 w-64 max-h-72 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10">
          {sections
            .filter((s) => s.results.length > 0)
            .map((section) => (
              <div key={section.label}>
                <p className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {section.label}
                </p>
                <ul>
                  {section.results.map((result) => (
                    <li
                      key={result.id}
                      onClick={() => handleClick(result.route, result.state)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                    >
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-zinc-100 text-sm">
                        {result.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
