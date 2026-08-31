import { clsx } from "clsx";
import React from "react";
import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

interface ItemProps extends TouchableOpacityProps {
  children: React.ReactNode;
  row?: boolean;
}

export function Item({ children, row = false, ...props }: ItemProps) {
  return (
    <TouchableOpacity
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
    </TouchableOpacity>
  );
}
