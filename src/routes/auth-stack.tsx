import { Login } from "@/screens/auth/login";
import { Onboarding } from "@/screens/auth/onboarding";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding"
    >
      <Screen name="Onboarding" component={Onboarding} />
      <Screen name="Login" component={Login} />
    </Navigator>
  );
}
