import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import {
  createFloatingTabBarOptions,
  FLOATING_TAB_BAR_SAFE_AREA_INSETS,
} from "@/routes/floating-tab-bar";
import { Home } from "@/screens/app/home";
import { Settings } from "@/screens/app/settings";
import { Users } from "@/screens/app/users/list";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { List, MapIcon, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabStackParamList = {
  Home: undefined;
  Users: undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<TabStackParamList>();

export function AppTabs() {
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();
  const floatingTabBarOptions = createFloatingTabBarOptions({
    colors: {
      background:
        theme === "dark" ? `${colors.surface}E6` : `${colors.background}E6`,
      border: colors.border,
      activeBackground: colors.primaryLight,
      activeContent: colors.primary,
      inactiveContent: colors.description,
    },
    insets,
    dark: theme === "dark",
    showLabels: true,
  });

  return (
    <View className="flex-1 bg-background">
      <Navigator
        safeAreaInsets={FLOATING_TAB_BAR_SAFE_AREA_INSETS}
        screenOptions={{
          headerShown: false,
          ...floatingTabBarOptions,
        }}
      >
        <Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Lista",
            tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
          }}
        />
        <Screen
          name="Users"
          component={Users}
          options={{
            tabBarLabel: "Users",
            tabBarIcon: ({ color, size }) => (
              <MapIcon size={size} color={color} />
            ),
          }}
        />
        <Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: "Conta",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Navigator>
    </View>
  );
}
