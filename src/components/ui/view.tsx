import { ComponentRef, forwardRef } from "react";
import { View as NativeView, type ViewProps } from "react-native";

export const View = forwardRef<ComponentRef<typeof NativeView>, ViewProps>(
  (props, ref) => <NativeView ref={ref} {...props} />,
);

View.displayName = "View";
