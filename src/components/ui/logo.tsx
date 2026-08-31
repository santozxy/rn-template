import { useTheme } from "@/hooks/use-theme";
import { ShieldCheck } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "./text";

interface LogoProps {
  compact?: boolean;
  name?: string;
}

export function Logo({ compact = false, name = "Template" }: LogoProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-3">
      <View
        className={`${compact ? "h-10 w-10 rounded-xl" : "h-16 w-16 rounded-2xl"} items-center justify-center bg-primary-light`}
      >
        <ShieldCheck color={colors.primary} size={compact ? 24 : 34} />
      </View>
      <Text
        className={`${compact ? "text-lg" : "text-2xl"} font-bold`}
        selectable
      >
        {name}
      </Text>
    </View>
  );
}
