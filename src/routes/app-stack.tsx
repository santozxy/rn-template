import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Settings } from "@/screens/app/settings";
import { CreateUser } from "@/screens/app/users/create";
import { UserDetails } from "@/screens/app/users/details";
import { UpdateUser } from "@/screens/app/users/update";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppTabs, type TabStackParamList } from "./tab-stack";

export type AppStackParamList = {
  App: NavigatorScreenParams<TabStackParamList> | undefined;
  UserCreate: undefined;
  UserDetails: { userId: string };
  UserUpdate: { userId: string };
  Settings: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  usePushNotifications({
    enabled: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === "true",
  });

  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="App">
      <Screen name="App" component={AppTabs} />
      <Screen
        name="UserCreate"
        component={CreateUser}
        options={{ gestureEnabled: false }}
      />
      <Screen name="UserDetails" component={UserDetails} />
      <Screen
        name="UserUpdate"
        component={UpdateUser}
        options={{ gestureEnabled: false }}
      />
      <Screen name="Settings" component={Settings} />
    </Navigator>
  );
}
