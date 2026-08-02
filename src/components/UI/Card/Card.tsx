import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Shared surface wrapper (bordered zinc panel, standard padding/shadow) used by match cards. */
export const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`border border-zinc-700 rounded-xl shadow-card px-4 py-3.5 w-full bg-zinc-900 text-white transition duration-300 hover:shadow-lg hover:border-amber-800 ${className}`}
  >
    {children}
  </div>
);
