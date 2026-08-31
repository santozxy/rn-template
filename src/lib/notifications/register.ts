import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export interface PushRegistrationResult {
  granted: boolean;
  token: string | null;
}

export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  if (!Device.isDevice) return { granted: false, token: null };

  const current = await Notifications.getPermissionsAsync();
  const permission =
    current.status === "granted"
      ? current
      : await Notifications.requestPermissionsAsync();

  if (permission.status !== "granted") {
    return { granted: false, token: null };
  }

  if (process.env.EXPO_OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Padrão",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId;
  const token = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );

  return { granted: true, token: token.data };
}
