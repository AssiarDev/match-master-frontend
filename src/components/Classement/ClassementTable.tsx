import type { StandingEntry } from '../../types'
import { ClassementTbody } from './ClassementTbody'
import { ClassmentThead } from './ClassementThead'

interface ClassementTableProps {
  standings: StandingEntry[]
}

/** Full standings table: renders a thead and one tbody row per entry. */
export const ClassementTable = ({ standings }: ClassementTableProps) => (
  <table className="min-w-[600px] sm:min-w-full w-full table-auto border-collapse">
    <ClassmentThead />
    {standings.map((item) => (
      <ClassementTbody key={item.position} item={item} />
    ))}
  </table>
)