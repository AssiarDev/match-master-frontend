import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Primary amber CTA button used across auth and profile forms. */
export const Button = ({ className = "", ...props }: ButtonProps) => (
  <button
    className={`bg-amber-600 text-white font-medium px-5 py-3 rounded-lg hover:bg-amber-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
);
