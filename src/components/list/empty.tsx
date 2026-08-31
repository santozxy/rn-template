import { Icon, type IconName } from "@/components/ui/icon";
import { View } from "react-native";
import { Text } from "../ui/text";

interface EmptyProps {
  message: string;
  iconName: IconName;
}

export function Empty({ message, iconName }: EmptyProps) {
  return (
    <View className="flex h-32 flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface">
      <Icon name={iconName} size={40} className="color-warning" />
      <Text className="text-foreground">{message}</Text>
    </View>
  );
}
