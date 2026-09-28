import { Skeleton } from "@/components/ui/skeleton";
import { View } from "@/components/ui/view";

export function LoadingUsers() {
  return (
    <View className="gap-4">
      <Skeleton width="100%" height={112} borderRadius={12} />
      <Skeleton width="100%" height={112} borderRadius={12} />
      <Skeleton width="100%" height={112} borderRadius={12} />
      <Skeleton width="100%" height={112} borderRadius={12} />
    </View>
  );
}
