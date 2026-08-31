export const badgeVariantStyles = {
  default: {
    background: "bg-primary/10",
    border: "border-primary/50 border",
    text: "text-primary",
  },
  outline: {
    background: "bg-background",
    border: "border-border border",
    text: "text-foreground",
  },
  secondary: {
    background: "bg-secondary/10",
    border: "border-secondary/50 border",
    text: "text-secondary",
  },
  warning: {
    background: "bg-warning/10",
    border: "border-warning/50 border",
    text: "text-warning",
  },
  destructive: {
    background: "bg-destructive/10",
    border: "border-destructive/50 border",
    text: "text-destructive",
  },
  success: {
    background: "bg-success/10",
    border: "border-success/50 border",
    text: "text-success",
  },
  info: {
    background: "bg-info/10",
    border: "border-info/50 border",
    text: "text-info",
  },
  "warning-orange": {
    background: "bg-orange-500/10",
    border: "border-orange-500/50 border",
    text: "text-orange-500",
  },
};

export type BadgeVariant = keyof typeof badgeVariantStyles;
