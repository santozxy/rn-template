import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { useUpload } from "@/hooks/use-upload";
import { toast } from "@/lib/toast";
import { UploadResult } from "@/providers/upload-provider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { logger } from "logger";
import { useRef, useState } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";

type Variant = "default" | "profile";

interface ControlledImageProps {
  label?: string;
  variant?: Variant;
}

export function ControlledImage<FormType extends FieldValues>({
  name,
  control,
  rules,
  label = "Imagem",
  variant = "default",
}: ControlledImageProps & UseControllerProps<FormType>) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const { pickImageFromCamera, pickImageFromLibrary } = useUpload();

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePresentModal = () => bottomSheetRef.current?.present();
  const handleDismissModal = () => bottomSheetRef.current?.dismiss();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handlePick = async (
          pickerFn: () => Promise<UploadResult | UploadResult[] | undefined>,
        ) => {
          setIsUploading(true);
          handleDismissModal();

          try {
            const result = await pickerFn();
            if (!result) return;

            const uploadResult = Array.isArray(result) ? result[0] : result;
            if (!uploadResult) return;

            const uri = `data:${uploadResult.mimeType};base64,${uploadResult.base64}`;
            onChange(uri);
          } catch (err) {
            toast.error("Erro ao processar imagem");
            logger.error("Upload error", err);
          } finally {
            setIsUploading(false);
          }
        };

        return (
          <View className="mb-4">
            {/* DEFAULT DESIGN */}
            {variant === "default" && (
              <>
                <Text className="mb-1 font-medium text-foreground">
                  {label ?? "Imagem"}
                  {rules?.required && (
                    <Text className="text-destructive"> *</Text>
                  )}
                </Text>

                <TouchableOpacity
                  onPress={handlePresentModal}
                  disabled={isUploading}
                  className={`flex-row items-center rounded-lg border p-3 ${
                    isUploading ? "bg-input-disabled" : "bg-input"
                  } ${error ? "border-destructive" : "border-border"}`}
                >
                  <Icon name="image" size={20} color={colors.foreground} />

                  {isUploading ? (
                    <View className="ml-2 flex-row items-center">
                      <Text className="ml-2 text-foreground">
                        Carregando...
                      </Text>
                      <ActivityIndicator
                        size="small"
                        color={colors.foreground}
                        className="ml-2"
                      />
                    </View>
                  ) : (
                    <Text className="ml-2 text-foreground">
                      {value ? "Alterar imagem" : "Selecionar imagem"}
                    </Text>
                  )}
                </TouchableOpacity>

                {value && (
                  <TouchableOpacity
                    onPress={() => setPreviewUri(value)}
                    className="mt-2"
                  >
                    <Image
                      source={{ uri: value }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* PROFILE DESIGN */}
            {variant === "profile" && (
              <View className="items-center">
                <TouchableOpacity
                  onPress={handlePresentModal}
                  activeOpacity={0.8}
                >
                  <View className="relative">
                    {!value && (
                      <View
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 999,
                          borderWidth: 2,
                          borderColor: colors.border,
                        }}
                        className="items-center justify-center bg-input"
                      >
                        <Icon
                          name="user"
                          size={40}
                          className="text-foreground"
                        />
                      </View>
                    )}

                    {value && (
                      <Image
                        source={{
                          uri: value,
                        }}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 999,
                          borderWidth: 2,
                          borderColor: colors.border,
                        }}
                      />
                    )}

                    <View className="absolute bottom-0 right-0 rounded-full bg-primary p-2">
                      <Icon
                        name="camera"
                        size={16}
                        className="text-primary-foreground"
                      />
                    </View>

                    {isUploading && (
                      <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
                        <ActivityIndicator className="text-white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                <Text className="mt-2 text-foreground">Alterar foto</Text>
              </View>
            )}

            {/* BOTTOM SHEET */}
            <BottomSheet
              ref={bottomSheetRef}
              title="Selecione uma opção"
              autoHeight
            >
              <TouchableOpacity
                className="w-full flex-row items-center gap-3 p-4"
                onPress={() => handlePick(pickImageFromCamera)}
              >
                <Icon name="camera" size={20} color={colors.foreground} />
                <Text className="text-foreground">Tirar foto</Text>
              </TouchableOpacity>

              <Separator />

              <TouchableOpacity
                className="w-full flex-row items-center gap-3 p-4"
                onPress={() => handlePick(() => pickImageFromLibrary(1))}
              >
                <Icon name="image" size={20} color={colors.foreground} />
                <Text className="text-foreground">Escolher da galeria</Text>
              </TouchableOpacity>
            </BottomSheet>

            {/* PREVIEW */}
            <Modal
              visible={!!previewUri}
              transparent
              onRequestClose={() => setPreviewUri(null)}
            >
              <View className="flex-1 items-center justify-center bg-black/90">
                <TouchableOpacity
                  onPress={() => setPreviewUri(null)}
                  className="absolute right-5 top-10 z-10 rounded-full bg-destructive p-2"
                >
                  <Icon name="x" size={22} color="#fff" />
                </TouchableOpacity>

                <Image
                  source={{ uri: previewUri! }}
                  style={{ width: "90%", height: "80%", borderRadius: 8 }}
                />
              </View>
            </Modal>

            {error && (
              <Text className="mt-1 text-sm text-destructive">
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
