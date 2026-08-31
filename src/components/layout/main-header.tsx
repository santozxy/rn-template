import { ResponsiveContainer } from "@/components/layout/responsive/container";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/use-auth";
import { useScreenSafeAreaInsets } from "@/hooks/use-screen-safe-area-insets";
import { useTheme } from "@/hooks/use-theme";
import { getFirstAndLastName } from "@/utils/text";
import { StatusBar } from "expo-status-bar";
import { Bell, UserRound } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface MainHeaderProps {
  onNotificationPress?: () => void;
}

export function MainHeader({ onNotificationPress }: MainHeaderProps) {
  const { auth } = useAuth();
  const { colors } = useTheme();
  const insets = useScreenSafeAreaInsets();

  return (
    <View
      className="min-h-20 bg-primary"
      style={{ paddingLeft: insets.left, paddingRight: insets.right }}
    >
      <StatusBar style="light" animated />
      <ResponsiveContainer
        padded
        className="flex-row items-center justify-between gap-3"
        style={{
          minHeight: 80 + insets.top,
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
            <UserRound color={colors.primaryForeground} size={20} />
          </View>
          <Text
            className="flex-1 font-semibold text-primary-foreground"
            numberOfLines={1}
          >
            Olá, {getFirstAndLastName(auth?.user.name) || "seja bem-vindo"}!
          </Text>
        </View>

        {onNotificationPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir notificações"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-primary-foreground/15"
            hitSlop={8}
            onPress={onNotificationPress}
          >
            <Bell color={colors.primaryForeground} size={20} />
          </Pressable>
        ) : null}
      </ResponsiveContainer>
    </View>
  );
}
