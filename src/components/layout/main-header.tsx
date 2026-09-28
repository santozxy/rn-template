import { ResponsiveContainer } from "@/components/layout/responsive/container";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useAuth } from "@/hooks/use-auth";
import { useScreenSafeAreaInsets } from "@/hooks/use-screen-safe-area-insets";
import { useTheme } from "@/hooks/use-theme";
import { getFirstAndLastName } from "@/utils/text";
import { StatusBar } from "expo-status-bar";
import { ToggleTheme } from "../ui/toggle-theme";

interface MainHeaderProps {
  title?: string;
  description?: string;
}

export function MainHeader({ title, description }: MainHeaderProps) {
  const { auth } = useAuth();
  const { theme } = useTheme();
  const insets = useScreenSafeAreaInsets();
  const resolvedTitle =
    title ??
    `Olá, ${getFirstAndLastName(auth?.user.name) || "seja bem-vindo"}!`;
  const resolvedDescription = description ?? "Acompanhe tudo em um só lugar.";

  return (
    <View style={{ paddingLeft: insets.left, paddingRight: insets.right }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} animated />
      <ResponsiveContainer
        padded
        className="flex-row items-center justify-between gap-4"
        style={{
          minHeight: 64 + insets.top,
          paddingTop: insets.top + 16,
        }}
      >
        <View className="flex-1">
          <Text
            className="font-bold text-2xl text-foreground"
            numberOfLines={2}
            selectable
          >
            {resolvedTitle}
          </Text>
          <Text
            className="text-base font-normal text-description"
            numberOfLines={1}
            selectable
          >
            {resolvedDescription}
          </Text>
        </View>
        <ToggleTheme />
      </ResponsiveContainer>
    </View>
  );
}
