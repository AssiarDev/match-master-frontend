import { Card } from "../UI/Card/Card";

interface MatchSkeletonGridProps {
  /** Number of placeholder cards to render (defaults to a full desktop row set). */
  count?: number;
}

/** Grey placeholder bar used to mock a line of text inside the skeleton. */
const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`rounded bg-zinc-700 ${className}`} />
);

/**
 * Placeholder card mirroring the MatchCard layout (date row + two team rows)
 * while matches are being fetched, so the grid keeps its height and no empty
 * state flashes between two dates.
 */
export const MatchSkeleton = () => (
  <Card className="animate-pulse">
    {/* Date + heure + statut */}
    <div className="flex items-center gap-2 mb-3">
      <Bar className="h-3 w-28" />
      <Bar className="ml-auto h-3 w-14" />
    </div>

    {/* Équipes + scores */}
    <div className="flex flex-col gap-2">
      {[0, 1].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Bar className="h-5 w-5 shrink-0 rounded-full" />
          <Bar className="h-7 w-7 shrink-0 rounded-full" />
          <Bar className="h-4 flex-1" />
          <Bar className="h-5 w-4" />
        </div>
      ))}
    </div>
  </Card>
);

/**
 * Grid of match skeletons using the same columns as CompetitionGroup,
 * announced to assistive technologies as a loading region.
 */
export const MatchSkeletonGrid = ({ count = 6 }: MatchSkeletonGridProps) => (
  <div
    role="status"
    aria-label="Chargement des matchs"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
  >
    {Array.from({ length: count }, (_, index) => (
      <MatchSkeleton key={index} />
    ))}
  </div>
);
