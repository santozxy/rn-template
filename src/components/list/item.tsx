import { Button, type ButtonProps } from "@/components/ui/button";
import { clsx } from "clsx";
import React from "react";

interface ItemProps extends ButtonProps {
  children: React.ReactNode;
  row?: boolean;
}

export function Item({ children, row = false, ...props }: ItemProps) {
  return (
    <Button
      variant="unstyled"
      size="content"
      {...props}
      activeOpacity={0.7}
      style={[{ flex: 1 }]}
      className={clsx(
        `overflow-hidden rounded-2xl border border-border bg-secondary py-3 ${
          row ? "flex-row items-center justify-between px-3" : "flex-col"
        } gap-3`,
        props.className,
      )}
    >
      {children}
    </Button>
  );
}
