import { Login } from "@/screens/auth/login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Login: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Screen name="Login" component={Login} />
    </Navigator>
  );
}
