import { Dialog } from "@/components/ui/dialog";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { logger } from "logger";
import React, { useCallback, useState } from "react";
import { BackHandler } from "react-native";
import { Screen, type ScreenProps } from "./screen";

export interface FormScreenProps extends Omit<
  ScreenProps,
  "canGoBack" | "onBackPress"
> {
  onExit?: () => void | Promise<void>;
  exitTitle?: string;
  exitDescription?: string;
}

export function FormScreen({
  onExit,
  exitTitle = "Atenção",
  exitDescription = "Você tem certeza que deseja sair? Todas as alterações serão perdidas.",
  ...screenProps
}: FormScreenProps) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();

  const requestExit = useCallback(() => setDialogVisible(true), []);

  const confirmExit = useCallback(async () => {
    setDialogVisible(false);
    try {
      await onExit?.();
    } catch (error) {
      logger.error("Error on form exit action", error);
    }
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation, onExit]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          requestExit();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [requestExit]),
  );

  return (
    <>
      <Screen
        {...screenProps}
        canGoBack={navigation.canGoBack()}
        onBackPress={requestExit}
      />
      <Dialog
        variant="destructive"
        show={dialogVisible}
        title={exitTitle}
        description={exitDescription}
        onCancel={() => setDialogVisible(false)}
        onConfirm={confirmExit}
      />
    </>
  );
}
