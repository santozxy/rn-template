import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import type { LucideIcon } from "lucide-react-native";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row gap-4 rounded-2xl border border-border bg-surface p-4"
      style={{ borderCurve: "continuous" }}
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-light">
        <Icon color={colors.primary} size={23} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-lg" selectable>
          {title}
        </Text>
        <Text className="text-description" selectable>
          {description}
        </Text>
      </View>
    </View>
  );
}
