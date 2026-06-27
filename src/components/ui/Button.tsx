import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-dark text-on-accent-dark hover:opacity-90 active:scale-[0.98]",
  secondary:
    "bg-surface text-accent-dark border border-border hover:bg-surface-hover active:scale-[0.98]",
  ghost: "bg-transparent text-accent-dark hover:bg-surface-hover",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
