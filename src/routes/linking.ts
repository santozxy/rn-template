import type { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { logger } from "logger";
import type { RootParamList } from "./types";

const appScheme = "rn-template://";

export const linking: LinkingOptions<RootParamList> = {
  prefixes: [Linking.createURL("/"), appScheme],
  config: {
    screens: {
      Login: "login",
      App: {
        screens: {
          Home: "",
          Users: "users",
          Settings: "settings",
        },
      },
      UserCreate: "users/new",
      UserDetails: "users/:userId",
      UserUpdate: "users/:userId/update",
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;

    const lastResponse = Notifications.getLastNotificationResponse();
    const notificationUrl = lastResponse?.notification.request.content.data
      ?.url as string | undefined;

    if (!notificationUrl) return null;
    return notificationUrl.startsWith(appScheme)
      ? notificationUrl
      : `${appScheme}${notificationUrl}`;
  },
  subscribe(listener) {
    const urlSubscription = Linking.addEventListener("url", ({ url }) => {
      listener(url);
    });
    const notificationSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notificationUrl = response.notification.request.content.data
          ?.url as string | undefined;
        if (!notificationUrl) return;

        const url = notificationUrl.startsWith(appScheme)
          ? notificationUrl
          : `${appScheme}${notificationUrl}`;
        logger.json("Notification URL received:", url);
        listener(url);
      });

    return () => {
      urlSubscription.remove();
      notificationSubscription.remove();
    };
  },
};
