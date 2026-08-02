import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/** Shared text field used across auth and profile forms. */
export const Input = ({
  className = "",
  error = false,
  ...props
}: InputProps) => (
  <input
    className={`text-zinc-100 text-sm h-10 w-full px-3.5 py-2.5 rounded-md border focus:ring ${
      error
        ? "border-red-500 focus:border-red-500"
        : "border-zinc-700 focus:border-amber-600"
    } ${className}`}
    {...props}
  />
);
