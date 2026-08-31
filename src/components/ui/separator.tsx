import { clsx } from "clsx";
import { View } from "react-native";

export function Separator({ className }: { className?: string }) {
  return <View className={clsx("mt-4 border-b border-border", className)} />;
}
