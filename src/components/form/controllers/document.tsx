import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { useUpload } from "@/hooks/use-upload";
import { toast } from "@/lib/toast";
import { UploadResult } from "@/providers/upload-provider";
import { logger } from "logger";
import { useState } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { ActivityIndicator } from "react-native";
import { View } from "@/components/ui/view";

export type ControlledDocumentValue = UploadResult & {
  name: string;
  base64: string;
};

interface ControlledDocumentProps {
  label?: string;
  description?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  allowedExtensions?: string[];
  maxSizeInBytes?: number;
}

const defaultAllowedExtensions = ["pfx", "p12"];
const defaultMaxSizeInBytes = 5 * 1024 * 1024;

export function ControlledDocument<FormType extends FieldValues>({
  name,
  control,
  rules,
  label = "Documento",
  description,
  placeholder = "Enviar documento",
  helperText,
  disabled,
  allowedExtensions = defaultAllowedExtensions,
  maxSizeInBytes = defaultMaxSizeInBytes,
}: ControlledDocumentProps & UseControllerProps<FormType>) {
  const { colors } = useTheme();
  const { pickDocument } = useUpload();
  const [isPicking, setIsPicking] = useState(false);

  const extensionLabel = allowedExtensions
    .map((extension) => `.${extension}`)
    .join(" ou ");

  const sizeLabel = formatBytes(maxSizeInBytes);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const document = value as ControlledDocumentValue | null | undefined;

        const handlePickDocument = async () => {
          if (disabled || isPicking) return;

          setIsPicking(true);

          try {
            const result = await pickDocument();

            if (!result) return;

            const fileName = result.name ?? "";
            const extension = getFileExtension(fileName);

            if (!allowedExtensions.includes(extension)) {
              toast.error(`Selecione um arquivo ${extensionLabel}.`);
              return;
            }

            if (result.size && result.size > maxSizeInBytes) {
              toast.error(`O arquivo deve ter no máximo ${sizeLabel}.`);
              return;
            }

            if (!result.base64) {
              toast.error("Não foi possível ler o arquivo selecionado.");
              return;
            }

            onChange({
              ...result,
              name: fileName,
              base64: result.base64,
            });
          } catch (err) {
            toast.error("Erro ao selecionar documento.");
            logger.error("Document pick error", err);
          } finally {
            setIsPicking(false);
          }
        };

        return (
          <View className="gap-1">
            <View className="flex-row items-center justify-between gap-2">
              <Text className="font-medium text-foreground" numberOfLines={1}>
                {label}{" "}
                {rules?.required && <Text className="text-destructive">*</Text>}
              </Text>

              <Text className="text-xs text-description" numberOfLines={1}>
                {helperText ?? `Arquivo ${extensionLabel} · máx. ${sizeLabel}`}
              </Text>
            </View>

            <Button
              variant="unstyled"
              size="content"
              activeOpacity={0.75}
              disabled={disabled || isPicking}
              onPress={handlePickDocument}
              className={`min-h-32 items-center justify-center rounded-xl border border-border px-4 py-5 ${
                error ? "border-destructive" : "border-border"
              } ${disabled || isPicking ? "bg-input-disabled" : "bg-input"}`}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-light">
                {isPicking ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Icon name="upload" size={22} color={colors.primary} />
                )}
              </View>

              <Text
                className="mt-3 text-center text-foreground"
                numberOfLines={2}
              >
                {document?.name ?? placeholder}
              </Text>

              <Text className="mt-2 text-center text-xs text-description">
                {description ??
                  `Toque para selecionar um arquivo ${extensionLabel}`}
              </Text>
            </Button>

            {error?.message && (
              <Text className="text-sm text-destructive">{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function formatBytes(bytes: number) {
  const megabytes = bytes / 1024 / 1024;
  return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
}
