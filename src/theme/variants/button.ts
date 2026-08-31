export const buttonVariantStyles = {
  default: {
    container: "bg-primary rounded-xl",
    text: "text-primary-foreground font-semibold",
    loading: "color-primary-foreground",
  },
  light: {
    container: "bg-primary-light rounded-xl",
    text: "text-primary",
    loading: "color-primary",
  },
  muted: {
    container: "bg-surface-muted rounded-xl",
    text: "text-foreground",
    loading: "color-primary",
  },
  outline: {
    container: "border border-border bg-transparent rounded-xl",
    text: "text-foreground",
    loading: "color-primary",
  },
  destructive: {
    container: "bg-destructive rounded-xl",
    text: "text-white font-semibold",
    loading: "color-white",
  },
  success: {
    container: "bg-success rounded-xl",
    text: "text-secondary font-semibold",
    loading: "color-white",
  },
  warning: {
    container: "bg-warning rounded-xl",
    text: "text-secondary font-semibold",
    loading: "color-white",
  },
  transparent: {
    container: "bg-transparent",
    text: "text-primary",
    loading: "color-primary",
  },
  link: {
    container: "bg-transparent",
    text: "text-primary underline",
    loading: "color-primary",
  },
  secondary: {
    container: "bg-secondary rounded-xl",
    text: "text-background",
    loading: "color-foreground",
  },
} as const;

export const buttonSizeStyles = {
  sm: {
    container: "h-10 px-4",
    content: "gap-1.5",
    text: "text-sm",
  },
  md: {
    container: "h-12 px-4",
    content: "gap-1.5",
    text: "",
  },
  lg: {
    container: "h-14 px-6",
    content: "gap-2",
    text: "text-lg",
  },
} as const;

export type ButtonVariant = keyof typeof buttonVariantStyles;
export type ButtonSize = keyof typeof buttonSizeStyles;
