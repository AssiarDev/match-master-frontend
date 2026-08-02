import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Shared surface wrapper (bordered zinc panel, standard padding/shadow) used by match cards. */
export const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`border border-zinc-700 rounded-xl shadow-md p-3 sm:p-4 w-full bg-zinc-900 text-white ${className}`}
  >
    {children}
  </div>
);
