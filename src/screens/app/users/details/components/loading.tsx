import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

function LoadingSection({ rows }: { rows: number }) {
  return (
    <View className="gap-2">
      <Skeleton width={140} height={12} />
      <View className="gap-4 rounded-xl border border-border bg-surface p-4">
        {Array.from({ length: rows }, (_, index) => (
          <View key={index} className="flex-row items-center gap-4">
            <Skeleton width="35%" height={14} />
            <View className="flex-1 items-end">
              <Skeleton width={index % 2 === 0 ? "72%" : "55%"} height={14} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function UserDetailsLoading() {
  return (
    <>
      <View className="items-center gap-3 rounded-xl border border-border bg-surface p-6">
        <Skeleton width={64} height={64} borderRadius={32} />
        <Skeleton width="55%" height={22} />
        <Skeleton width="70%" height={14} />
      </View>
      <LoadingSection rows={4} />
      <LoadingSection rows={4} />
    </>
  );
}
