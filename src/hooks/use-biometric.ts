import {
  credentialsStorage,
  type StoredCredentials,
} from "@/storage/auth/credentials";
import * as LocalAuthentication from "expo-local-authentication";
import React from "react";
import { Platform } from "react-native";

type BiometricState = {
  isBiometricAvailable: boolean;
  canUseBiometricLogin: boolean;
  biometricLabel: string;
  biometricCredentials: StoredCredentials | null;
  isBiometricLoading: boolean;
  saveCredentials: (credentials: StoredCredentials) => Promise<void>;
  saveBiometricCredentials: (credentials: StoredCredentials) => Promise<void>;
  authenticateWithBiometrics: () => Promise<{
    credentials: StoredCredentials | null;
    cancelled: boolean;
  }>;
  clearBiometricCredentials: () => Promise<void>;
};

export function useBiometric(): BiometricState {
  const [isBiometricAvailable, setIsBiometricAvailable] = React.useState(false);
  const [biometricLabel, setBiometricLabel] = React.useState("biometria");
  const [biometricCredentials, setBiometricCredentials] =
    React.useState<StoredCredentials | null>(null);
  const [canUseBiometricLogin, setCanUseBiometricLogin] = React.useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = React.useState(false);

  const refreshBiometricState = React.useCallback(async () => {
    const [availability, credentials] = await Promise.all([
      getBiometricAvailability(),
      credentialsStorage.get(),
    ]);

    setIsBiometricAvailable(availability.isAvailable);
    setBiometricLabel(availability.label);
    setBiometricCredentials(credentials);
    setCanUseBiometricLogin(
      availability.isAvailable && Boolean(credentials?.biometricEnabled),
    );
  }, []);

  React.useEffect(() => {
    refreshBiometricState();
  }, [refreshBiometricState]);

  const saveCredentials = React.useCallback(
    async (credentials: StoredCredentials) => {
      await credentialsStorage.set(credentials);
      await refreshBiometricState();
    },
    [refreshBiometricState],
  );

  const saveBiometricCredentials = React.useCallback(
    async (credentials: StoredCredentials) => {
      await saveCredentials({
        ...credentials,
        biometricEnabled: true,
      });
    },
    [saveCredentials],
  );

  const clearBiometricCredentials = React.useCallback(async () => {
    await credentialsStorage.remove();
    await refreshBiometricState();
  }, [refreshBiometricState]);

  const authenticateWithBiometrics = React.useCallback(async () => {
    try {
      setIsBiometricLoading(true);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          biometricLabel === "Face ID"
            ? "Entrar com Face ID"
            : `Entrar com ${biometricLabel}`,
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
        fallbackLabel: "Usar senha do aparelho",
      });

      if (!result.success) {
        if (
          result.error === "user_cancel" ||
          result.error === "system_cancel" ||
          result.error === "app_cancel"
        ) {
          return {
            credentials: null,
            cancelled: true,
          };
        }

        throw new Error(getBiometricErrorMessage(result.error));
      }

      const credentials = await credentialsStorage.get();
      if (!credentials) {
        setCanUseBiometricLogin(false);
        return {
          credentials: null,
          cancelled: false,
        };
      }

      return {
        credentials,
        cancelled: false,
      };
    } finally {
      setIsBiometricLoading(false);
    }
  }, [biometricLabel]);

  return {
    isBiometricAvailable,
    canUseBiometricLogin,
    biometricLabel,
    biometricCredentials,
    isBiometricLoading,
    saveBiometricCredentials,
    saveCredentials,
    authenticateWithBiometrics,
    clearBiometricCredentials,
  };
}

async function getBiometricAvailability() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    return {
      isAvailable: false,
      label: "biometria",
    };
  }

  const authenticationTypes =
    await LocalAuthentication.supportedAuthenticationTypesAsync();

  return {
    isAvailable: authenticationTypes.length > 0,
    label: getBiometricLabel(authenticationTypes),
  };
}

function getBiometricLabel(
  authenticationTypes: LocalAuthentication.AuthenticationType[],
): string {
  if (Platform.OS === "android") {
    return "digital";
  }

  if (
    Platform.OS === "ios" &&
    authenticationTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    )
  ) {
    return "Face ID";
  }

  if (
    Platform.OS === "ios" &&
    authenticationTypes.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    )
  ) {
    return "Touch ID";
  }

  return "digital";
}

function getBiometricErrorMessage(
  error: LocalAuthentication.LocalAuthenticationError,
) {
  switch (error) {
    case "not_enrolled":
      return "Nenhuma biometria foi cadastrada neste dispositivo.";
    case "lockout":
      return "Biometria temporariamente bloqueada. Tente novamente em instantes.";
    case "not_available":
      return "A biometria nao esta disponivel neste dispositivo.";
    case "passcode_not_set":
      return "Configure o bloqueio do dispositivo para usar biometria.";
    default:
      return "Nao foi possivel autenticar com biometria.";
  }
}
