import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { Home } from "@/screens/app/home";
import { Settings } from "@/screens/app/settings";
import { Users } from "@/screens/app/users/list";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  House,
  Settings as SettingsIcon,
  UsersRound,
} from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabStackParamList = {
  Home: undefined;
  Users: undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<TabStackParamList>();
const isIOS = process.env.EXPO_OS === "ios";

function TabLabel({
  focused,
  children,
}: React.PropsWithChildren<{ focused: boolean }>) {
  return (
    <Text
      className={`text-xs ${focused ? "text-primary" : "text-description"}`}
    >
      {children}
    </Text>
  );
}

export function AppTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View className="flex-1 bg-background">
      <Navigator
        safeAreaInsets={insets}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.description,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabLabel focused={focused}>Início</TabLabel>
            ),
            tabBarIcon: ({ color }) => (
              <House size={isIOS ? 25 : 20} color={color} />
            ),
          }}
        />
        <Screen
          name="Users"
          component={Users}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabLabel focused={focused}>Usuários</TabLabel>
            ),
            tabBarIcon: ({ color }) => (
              <UsersRound size={isIOS ? 25 : 20} color={color} />
            ),
          }}
        />
        <Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabLabel focused={focused}>Configurações</TabLabel>
            ),
            tabBarIcon: ({ color }) => (
              <SettingsIcon size={isIOS ? 25 : 20} color={color} />
            ),
          }}
        />
      </Navigator>
    </View>
  );
}
