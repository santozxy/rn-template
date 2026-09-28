import { ModeBanner } from "@/components/layout/mode-banner";
import { OfflineBanner } from "@/components/ui/offline-mode";
import { View } from "@/components/ui/view";
import { useAuth } from "@/hooks/use-auth";
import { useNetwork } from "@/hooks/use-network";
import { useHasUnavailableOfflineQueries } from "@/hooks/use-offline-query-state";
import { useTheme } from "@/hooks/use-theme";
import { queryPersistenceConfig } from "@/lib/tanstack-query/config";
import { isQueryStoragePersistent } from "@/storage/query/storage";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { AppStack } from "./app-stack";
import { AuthStack } from "./auth-stack";
import { linking } from "./linking";
import { LoadingScreen } from "./loading";

export function Routes() {
  const { auth, isLoading } = useAuth();
  const { status } = useNetwork();
  const hasUnavailableData = useHasUnavailableOfflineQueries();
  const { colors, theme } = useTheme();
  const navigationTheme = useMemo(() => {
    const baseTheme = theme === "dark" ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.foreground,
        border: colors.border,
        notification: colors.destructive,
      },
    };
  }, [colors, theme]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={theme === "dark" ? "light" : "dark"} animated />
      <ModeBanner />
      {(status === "offline" || status === "unavailable") && (
        <OfflineBanner
          status={status}
          hasUnavailableData={hasUnavailableData}
          persistenceAvailable={
            queryPersistenceConfig.enabled && isQueryStoragePersistent()
          }
        />
      )}
      <NavigationContainer linking={linking} theme={navigationTheme}>
        {isLoading ? <LoadingScreen /> : auth ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </View>
  );
}
