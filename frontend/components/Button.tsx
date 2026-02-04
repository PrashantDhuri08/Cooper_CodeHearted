import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md";

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 active:bg-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white active:bg-red-800",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
