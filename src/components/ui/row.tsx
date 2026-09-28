import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "@/lib/toast";
import * as Clipboard from "expo-clipboard";
import { View } from "@/components/ui/view";

interface RenderRowProps {
  label?: string;
  value?: string | number | null;
  isLoading?: boolean;
  variant?: "destructive" | "primary" | "warning";
  lineHeight?: number;
}

export function Row({
  label,
  value,
  isLoading,
  variant,
  lineHeight,
}: RenderRowProps) {
  const { colors } = useTheme();

  const valueClass = {
    destructive: "text-destructive font-semibold",
    primary: "text-primary font-semibold",
    warning: "text-warning font-semibold",
    default: "text-foreground",
  }[variant ?? "default"];

  const textValue = value ? value.toString() : "N/A";

  const handleCopy = () => {
    if (value) {
      Clipboard.setStringAsync(value.toString());
      toast.success(`${label} copiado para a área de transferência!`);
    }
  };

  return (
    <View
      className="flex-row flex-wrap justify-between border-b py-2"
      style={{ borderColor: colors.border }}
    >
      {label && <Text className="text-label">{label}:</Text>}

      {isLoading ? (
        <Skeleton width={120} height={14} />
      ) : (
        <Button
          variant="unstyled"
          size="content"
          activeOpacity={0.8}
          disabled={!value || value === "N/A" || !variant}
          onPress={handleCopy}
        >
          <Text
            className={`font-medium ${!value || value === "N/A" ? "text-foreground" : valueClass}`}
            style={{ lineHeight }}
          >
            {textValue}
          </Text>
        </Button>
      )}
    </View>
  );
}
