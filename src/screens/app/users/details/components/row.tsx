import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface DetailRowProps {
  label: string;
  value?: string | null;
  last?: boolean;
}

export function DetailRow({ label, value, last = false }: DetailRowProps) {
  return (
    <View
      className={`flex-row items-center justify-between border-b border-border py-3 ${last ? "border-b-0" : ""}`}
    >
      <Text
        className="text-sm leading-5 text-description"
        style={{ flex: 0.4 }}
      >
        {label}
      </Text>
      <Text
        selectable
        className="flex-1 text-right text-sm leading-5 text-foreground"
      >
        {value || "Não informado"}
      </Text>
    </View>
  );
}
