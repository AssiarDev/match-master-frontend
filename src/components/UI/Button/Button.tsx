import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger-outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-amber-600 text-white hover:bg-amber-700",
  secondary: "bg-zinc-700 text-zinc-100 hover:bg-zinc-600",
  "danger-outline":
    "border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
};

/** CTA button used across auth, profile, and consent forms. `primary` (amber) is the default; `secondary` (zinc) is for non-destructive dismiss/neutral actions; `danger-outline` (red border) is for irreversible destructive actions. */
export const Button = ({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    className={`${VARIANT_CLASSES[variant]} font-medium px-5 py-3 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
);
