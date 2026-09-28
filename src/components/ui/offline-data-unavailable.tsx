import { Icon } from "@/components/ui/icon";
import { Text } from "./text";
import { View } from "@/components/ui/view";

interface OfflineDataUnavailableProps {
  message?: string;
}

export function OfflineDataUnavailable({
  message = "Estas informações ainda não foram sincronizadas neste dispositivo.",
}: OfflineDataUnavailableProps) {
  return (
    <View className="items-center gap-3 rounded-md border border-border bg-surface p-6">
      <Icon name="cloud-off-outline" size={48} className="text-warning" />
      <Text className="text-center text-foreground">{message}</Text>
      <Text className="text-center text-sm text-description">
        Elas serão carregadas automaticamente quando a conexão voltar.
      </Text>
    </View>
  );
}
