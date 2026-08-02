import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Primary amber CTA button used across auth and profile forms. */
export const Button = ({ className = "", ...props }: ButtonProps) => (
  <button
    className={`bg-amber-600 text-zinc-950 py-2 rounded hover:bg-amber-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
);
