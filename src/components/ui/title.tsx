import { clsx } from "clsx";
import React from "react";
import { Text } from "./text";

type TitleProps = React.ComponentProps<typeof Text>;

export function Title({ children, ...props }: TitleProps) {
  return (
    <Text
      {...props}
      numberOfLines={props.numberOfLines || 1}
      className={clsx("font-medium text-lg text-foreground", props.className)}
    >
      {children}
    </Text>
  );
}
