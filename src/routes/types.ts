import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "./app-stack";
import type { AuthStackParamList } from "./auth-stack";
import type { TabStackParamList } from "./tab-stack";

export type RootParamList = AppStackParamList & AuthStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends AppStackParamList, AuthStackParamList, TabStackParamList {}
  }
}

export type AppScreenProps<RouteName extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, RouteName>;

export type AuthScreenProps<RouteName extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, RouteName>;

export type AppTabScreenProps<RouteName extends keyof TabStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabStackParamList, RouteName>,
    NativeStackScreenProps<AppStackParamList>
  >;

export type AppTabsParams = NavigatorScreenParams<TabStackParamList>;
