import { isDemo, isLocal } from "@/api/config";
import { resolveTopInset } from "@/providers/screen-safe-area-provider";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";

interface ModeBannerProps {
  message?: string;
}

export function ModeBanner({
  message = "📢 📢  Ambiente de homologação.",
}: ModeBannerProps) {
  const insets = useSafeAreaInsets();
  const topInset = resolveTopInset(insets.top);

  if (isDemo) {
    return (
      <View
        className="overflow-hidden bg-warning pb-1"
        style={{
          paddingTop: topInset + 4,
          paddingRight: insets.right + 4,
          paddingLeft: insets.left + 4,
        }}
      >
        <Text className="text-center font-semibold text-white">{message}</Text>
      </View>
    );
  }

  if (isLocal) {
    return (
      <View
        className="overflow-hidden bg-warning pb-1"
        style={{
          paddingTop: topInset + 4,
          paddingRight: insets.right + 4,
          paddingLeft: insets.left + 4,
        }}
      >
        <Text className="text-center font-semibold text-white">
          🧑🏽‍💻 Ambiente de desenvolvimento 🧑🏽‍💻
        </Text>
      </View>
    );
  }
}
