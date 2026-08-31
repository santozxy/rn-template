import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { Bell, BellOff } from "lucide-react-native";

export function ToggleNotification() {
  const { colors } = useTheme();
  // const { notificationsEnabled, isLoading, setNotificationsEnabled } =
  //   usePreferences();

  return (
    <Switch
      value={true}
      onValueChange={() => {}}
      disabled={false}
      activeColor={colors.primary}
      thumbColor={colors.background}
      inactiveColor={colors.inputDisabled}
      icon={
        true ? (
          <Bell className="h-[18px] w-[18px] text-warning" />
        ) : (
          <BellOff className="h-[18px] w-[18px] text-warning" />
        )
      }
    />
  );
}
