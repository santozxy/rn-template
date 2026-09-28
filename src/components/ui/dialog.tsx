import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import type { ButtonVariant } from "@/theme/variants/button";
import React, { useEffect, useState } from "react";
import { GestureResponderEvent, Modal } from "react-native";
import { Button } from "./button";
import { Input } from "./input";

export type DialogVariant = "default" | "destructive" | "success" | "warning";

export interface DialogProps {
  /** Conteúdo do botão que abre o modal */
  trigger?: (props: { open: () => void }) => React.ReactNode;

  /** Callback ao confirmar */
  onConfirm: (e: GestureResponderEvent) => Promise<void> | void;

  /** Callback ao cancelar (apenas modo controlado) */
  onCancel?: () => void;

  /** Título e descrição do modal */
  title?: string;
  description?: string;

  /** Textos dos botões */
  confirmText?: string;
  cancelText?: string;
  hideCancelButton?: boolean;

  /** Estado de carregamento */
  loading?: boolean;

  /** Estilo de variante */
  variant?: DialogVariant;

  /** Controle externo do estado de exibição */
  show?: boolean;
}

export interface DialogJustificationProps extends Omit<
  DialogProps,
  "onConfirm"
> {
  /** Callback ao confirmar com justificativa */
  onConfirm: (justification: string) => Promise<void> | void;
}

const dialogVariantStyles = {
  default: {
    title: "text-primary",
    button: "default",
  },
  destructive: {
    title: "text-destructive",
    button: "destructive",
  },
  success: {
    title: "text-success",
    button: "success",
  },
  warning: {
    title: "text-warning",
    button: "warning",
  },
} as const satisfies Record<
  DialogVariant,
  { title: string; button: ButtonVariant }
>;

export function Dialog({
  trigger,
  onConfirm,
  onCancel,
  title = "Confirmar ação",
  description = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  hideCancelButton = false,
  variant = "default",
  loading = false,
  show,
}: DialogProps) {
  const [internalVisible, setInternalVisible] = useState(false);

  // Determina se o componente é controlado externamente
  const isControlled = typeof show === "boolean";
  const visible = isControlled ? show! : internalVisible;
  const variantStyle = dialogVariantStyles[variant];

  const open = () => {
    if (!isControlled) setInternalVisible(true);
  };

  const close = () => {
    if (!isControlled) setInternalVisible(false);
    else onCancel?.();
  };

  const handleConfirm = async (e: GestureResponderEvent) => {
    try {
      await onConfirm(e);
      close();
    } catch {
      // A ação mantém o diálogo aberto para permitir nova tentativa.
    }
  };

  // Garante sincronização quando o componente é controlado externamente
  useEffect(() => {
    if (isControlled) {
      setInternalVisible(show ?? false);
    }
  }, [isControlled, show]);

  return (
    <>
      {trigger && trigger({ open })}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={close}
      >
        <View className="flex-1 items-center justify-center bg-black/50 p-6">
          <View className="w-full max-w-md gap-4 rounded-2xl border border-border bg-background p-4">
            <Text className={`font-semibold text-xl ${variantStyle.title}`}>
              {title}
            </Text>

            <Text className="text-description">{description}</Text>

            <View className="mt-4 flex-row justify-end gap-4">
              {!hideCancelButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={close}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
              )}

              <Button
                variant={variantStyle.button}
                size="sm"
                onPress={handleConfirm}
                disabled={loading}
                loading={loading}
              >
                {confirmText}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function DialogJustification({
  trigger,
  onConfirm,
  onCancel,
  title = "Confirmar ação",
  description = "Digite uma justificativa para continuar.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  loading = false,
  show,
}: DialogJustificationProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [justification, setJustification] = useState("");

  const isControlled = typeof show === "boolean";
  const visible = isControlled ? show! : internalVisible;
  const variantStyle = dialogVariantStyles[variant];

  const open = () => {
    if (!isControlled) setInternalVisible(true);
  };

  const close = () => {
    if (!isControlled) setInternalVisible(false);
    else onCancel?.();
    setJustification("");
  };

  const handleConfirm = async () => {
    if (!justification.trim()) return;
    await onConfirm(justification.trim());
    close();
  };

  useEffect(() => {
    if (isControlled) setInternalVisible(show ?? false);
  }, [isControlled, show]);

  return (
    <>
      {trigger && trigger({ open })}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={close}
      >
        <View className="flex-1 items-center justify-center bg-black/50 p-6">
          <View className="w-full max-w-md gap-4 rounded-2xl border border-border bg-background p-4">
            <Text className={`font-semibold text-xl ${variantStyle.title}`}>
              {title}
            </Text>
            {description && (
              <Text className="text-description">{description}</Text>
            )}
            <Input
              placeholder="Digite a justificativa..."
              value={justification}
              onChangeText={setJustification}
              textArea
              className="rounded-2xl border border-border bg-secondary p-3 text-foreground"
              enterKeyHint="done"
            />

            <View className="mt-4 flex-row justify-end gap-4">
              <Button
                variant="outline"
                size="sm"
                onPress={close}
                disabled={loading}
              >
                {cancelText}
              </Button>

              <Button
                variant={variantStyle.button}
                size="sm"
                onPress={handleConfirm}
                disabled={loading || !justification.trim()}
                loading={loading}
              >
                {confirmText}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
