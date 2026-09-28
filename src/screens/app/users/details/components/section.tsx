import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import type { PropsWithChildren } from "react";

interface DetailSectionProps extends PropsWithChildren {
  title: string;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <View className="gap-2">
      <Text className="font-bold text-sm uppercase tracking-wide">{title}</Text>
      <View className="overflow-hidden rounded-xl border border-border bg-surface px-4">
        {children}
      </View>
    </View>
  );
}
