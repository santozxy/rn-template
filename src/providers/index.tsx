import { isDemo, isLocal } from "@/api/config";
import { toastConfig } from "@/lib/toast/config";
import { initializeNativeWindInterop } from "@/lib/nativewind/config";
import { initializeStorage, MMKVStorage } from "@/storage/config";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./auth-provider";
import { NetworkProvider } from "./network-provider";
import { ScreenSafeAreaProvider } from "./screen-safe-area-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";
import { ThemeProvider } from "./theme-provider";
import { UploadProvider } from "./upload-provider";

initializeStorage(MMKVStorage);
initializeNativeWindInterop();

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ScreenSafeAreaProvider consumeTop={isDemo || isLocal}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <KeyboardProvider>
              <UploadProvider>
                <AuthProvider>
                  <TanstackQueryProvider>
                    <NetworkProvider>
                      <BottomSheetModalProvider>
                        {children}
                      </BottomSheetModalProvider>
                    </NetworkProvider>
                  </TanstackQueryProvider>
                  <Toast config={toastConfig} />
                </AuthProvider>
              </UploadProvider>
            </KeyboardProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </ScreenSafeAreaProvider>
    </SafeAreaProvider>
  );
}
