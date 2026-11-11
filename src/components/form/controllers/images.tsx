import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import { useUpload } from "@/hooks/use-upload";
import { toast } from "@/lib/toast";
import type { UploadResult } from "@/providers/upload-provider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { logger } from "logger";
import { useRef, useState } from "react";
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";
import { ActivityIndicator } from "react-native";

interface ControlledImagesProps {
  label?: string;
  limit?: number;
  className?: string;
}

function getImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getImageUri(result: UploadResult) {
  if (!result.base64) return result.uri;

  return `data:${result.mimeType ?? "image/jpeg"};base64,${result.base64}`;
}

export function ControlledImages<FormType extends FieldValues>({
  name,
  control,
  rules,
  label = "Imagens",
  limit = 5,
  className,
}: ControlledImagesProps & UseControllerProps<FormType>) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const { pickImageFromCamera, pickImageFromLibrary } = useUpload();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name, rules });
  const images = getImages(value);
  const maximumImages = Math.max(1, limit);
  const remainingImages = maximumImages - images.length;
  const canAddImages = remainingImages > 0;

  const closeOptions = () => bottomSheetRef.current?.dismiss();

  const selectImages = async (
    picker: () => Promise<UploadResult | UploadResult[] | undefined>,
  ) => {
    if (!canAddImages || isUploading) return;

    setIsUploading(true);
    closeOptions();

    try {
      const result = await picker();
      if (!result) return;

      const selectedImages = (Array.isArray(result) ? result : [result])
        .slice(0, remainingImages)
        .map(getImageUri);

      onChange([...images, ...selectedImages]);
    } catch (error) {
      logger.error("Não foi possível processar as imagens", error);
      toast.error("Não foi possível processar as imagens.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className={`gap-2 ${className ?? ""}`}>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold" selectable>
          {label}
          {rules?.required ? (
            <Text className="text-destructive"> *</Text>
          ) : null}
        </Text>
        <Text className="text-sm text-description">
          {images.length}/{maximumImages}
        </Text>
      </View>

      <Button
        variant="unstyled"
        size="content"
        disabled={!canAddImages || isUploading}
        onPress={() => bottomSheetRef.current?.present()}
        className={`flex-row items-center gap-2 rounded-xl border p-3 ${
          !canAddImages || isUploading ? "bg-input-disabled" : "bg-input"
        } ${error ? "border-destructive" : "border-border"}`}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color={colors.foreground} />
        ) : (
          <Icon name="plus-circle" size={20} color={colors.foreground} />
        )}
        <Text className="flex-1">
          {isUploading
            ? "Processando imagens..."
            : canAddImages
              ? "Adicionar imagens"
              : "Limite de imagens atingido"}
        </Text>
      </Button>

      {images.length ? (
        <View className="flex-row flex-wrap gap-3 pt-1">
          {images.map((uri, index) => (
            <View key={`${uri}-${index}`} className="relative">
              <Button
                variant="unstyled"
                size="content"
                accessibilityLabel={`Visualizar imagem ${index + 1}`}
                onPress={() => setPreviewUri(uri)}
              >
                <Image
                  source={{ uri }}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              </Button>
              <Button
                variant="destructive"
                size="content"
                accessibilityLabel={`Remover imagem ${index + 1}`}
                className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full"
                onPress={() =>
                  onChange(
                    images.filter((_, imageIndex) => imageIndex !== index),
                  )
                }
              >
                <Icon name="x" size={16} className="color-white" />
              </Button>
            </View>
          ))}
        </View>
      ) : null}

      {error?.message ? (
        <Text
          accessibilityRole="alert"
          className="text-sm text-destructive"
          selectable
        >
          {error.message}
        </Text>
      ) : null}

      <BottomSheet ref={bottomSheetRef} title="Adicionar imagens" autoHeight>
        <Button
          variant="unstyled"
          size="content"
          className="w-full flex-row items-center gap-3 p-4"
          onPress={() => selectImages(pickImageFromCamera)}
        >
          <Icon name="camera" size={20} color={colors.foreground} />
          <Text>Tirar foto</Text>
        </Button>

        <Separator />

        <Button
          variant="unstyled"
          size="content"
          className="w-full flex-row items-center gap-3 p-4"
          onPress={() =>
            selectImages(() => pickImageFromLibrary(remainingImages))
          }
        >
          <Icon name="image" size={20} color={colors.foreground} />
          <Text>Escolher da galeria</Text>
        </Button>
      </BottomSheet>

      <Modal visible={Boolean(previewUri)} onClose={() => setPreviewUri(null)}>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-lg">Visualizar imagem</Text>
            <Button
              variant="unstyled"
              size="content"
              accessibilityLabel="Fechar visualização"
              className="h-11 w-11 items-center justify-center"
              onPress={() => setPreviewUri(null)}
            >
              <Icon name="x" size={22} color={colors.foreground} />
            </Button>
          </View>
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={{ width: "100%", aspectRatio: 1, borderRadius: 16 }}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}
