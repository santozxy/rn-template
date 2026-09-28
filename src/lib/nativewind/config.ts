import { Image } from "expo-image";
import { logger } from "logger";
import { Icon as LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { ActivityIndicator, RefreshControl } from "react-native";

export function initializeNativeWindInterop() {
  logger.info("Inicializando interop de NativeWind");

  cssInterop(ActivityIndicator, {
    className: {
      target: "style",
      nativeStyleToProp: { color: "color" },
    },
  });

  cssInterop(RefreshControl, {
    className: {
      target: "style",
      nativeStyleToProp: { color: "tintColor" },
    },
  });

  cssInterop(Image, {
    className: {
      target: "style",
      nativeStyleToProp: { tintColor: "tintColor" },
    },
  });

  cssInterop(LucideIcon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: "color",
        height: "height",
        width: "width",
      },
    },
  });
}
