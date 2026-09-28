import { useTheme } from "@/hooks/use-theme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./text";
import { View } from "@/components/ui/view";

type BottomSheetType = "default" | "modal";

export interface BottomSheetProps extends React.ComponentProps<
  typeof BottomSheetModal
> {
  title?: string;
  children: ReactNode;
  closeOnBackdropPress?: boolean;
  type?: BottomSheetType;
  /**
   * Snap points fixos (ex: ["40%", "90%"])
   * Se não passar nada e autoHeight={false} → usa ["50%", "90%"]
   */
  snapPoints?: (string | number)[];
  /**
   * Altura automática baseada no conteúdo (recomendado na maioria dos casos)
   */
  autoHeight?: boolean;
  /**
   * Limite máximo de altura quando autoHeight={true} (em pixels)
   */
  maxDynamicHeight?: number;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  (
    {
      title,
      children,
      type = "default",
      snapPoints,
      autoHeight = false,
      maxDynamicHeight,
      closeOnBackdropPress = true,
      index,
      enableContentPanningGesture,
      enableDynamicSizing,
      backdropComponent,
      backgroundStyle,
      handleIndicatorStyle,
      topInset,
      bottomInset,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const isModal = type === "modal";

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={closeOnBackdropPress ? "close" : "none"}
          enableTouchThrough={false}
          opacity={isModal ? 0.55 : 0.6}
        />
      ),
      [closeOnBackdropPress, isModal],
    );

    const defaultSnapPoints = useMemo(() => ["50%", "90%"], []);
    const modalSnapPoints = useMemo(() => ["85%"], []);
    const resolvedSnapPoints =
      snapPoints ?? (isModal ? modalSnapPoints : defaultSnapPoints);
    const resolvedEnableDynamicSizing = autoHeight
      ? true
      : (enableDynamicSizing ?? (isModal ? false : undefined));
    const resolvedBorderRadius = isModal ? 28 : 20;
    const resolvedTopInset = topInset ?? safeAreaInsets.top;
    const resolvedBottomInset = bottomInset ?? safeAreaInsets.bottom;

    if (isModal) {
      return (
        <BottomSheetModal
          ref={ref}
          index={index ?? 0}
          snapPoints={autoHeight ? undefined : resolvedSnapPoints}
          enableDynamicSizing={resolvedEnableDynamicSizing}
          maxDynamicContentSize={autoHeight ? maxDynamicHeight : undefined}
          topInset={resolvedTopInset}
          bottomInset={resolvedBottomInset}
          enablePanDownToClose
          enableContentPanningGesture={enableContentPanningGesture ?? false}
          backdropComponent={backdropComponent ?? renderBackdrop}
          handleIndicatorStyle={
            handleIndicatorStyle ?? { backgroundColor: colors.border }
          }
          backgroundStyle={
            backgroundStyle ?? {
              backgroundColor: colors.background,
              borderTopLeftRadius: resolvedBorderRadius,
              borderTopRightRadius: resolvedBorderRadius,
            }
          }
          {...rest}
        >
          <View className="flex-1 p-4">
            {title && (
              <Text className="mb-4 text-center font-semibold text-xl text-foreground">
                {title}
              </Text>
            )}
            {children}
          </View>
        </BottomSheetModal>
      );
    }

    return (
      <BottomSheetModal
        ref={ref}
        index={index}
        snapPoints={autoHeight ? undefined : resolvedSnapPoints}
        enableDynamicSizing={resolvedEnableDynamicSizing}
        maxDynamicContentSize={autoHeight ? maxDynamicHeight : undefined}
        topInset={resolvedTopInset}
        bottomInset={resolvedBottomInset}
        enablePanDownToClose
        enableContentPanningGesture={enableContentPanningGesture}
        backdropComponent={backdropComponent ?? renderBackdrop}
        handleIndicatorStyle={
          handleIndicatorStyle ?? { backgroundColor: colors.border }
        }
        backgroundStyle={
          backgroundStyle ?? {
            backgroundColor: colors.background,
            borderTopLeftRadius: resolvedBorderRadius,
            borderTopRightRadius: resolvedBorderRadius,
          }
        }
        {...rest}
      >
        <BottomSheetView className="flex-1 p-4">
          {title && (
            <Text className="mb-4 text-center font-semibold text-xl text-foreground">
              {title}
            </Text>
          )}
          <View className="flex-1">{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = "BottomSheet";
