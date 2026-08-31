import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import type { User } from "@/domains/users/types";
import { formatPhone } from "@/utils/masks";
import { Trash2, UserRound } from "lucide-react-native";
import {
  Pressable,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from "react-native";

interface UserItemProps {
  item: User;
  onPress: (item: User) => void;
  onDelete: (item: User) => void;
}

export function UserItem({ item, onPress, onDelete }: UserItemProps) {
  const handleDelete = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onDelete(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-surface p-4"
      onPress={() => onPress(item)}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-light">
        <UserRound size={22} className="text-primary" />
      </View>
      <View className="flex-1 gap-1">
        <Text
          className="font-semibold text-lg text-foreground"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-description" numberOfLines={1}>
          {item.email}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-sm text-description">
            {formatPhone(item.phone)}
          </Text>
          <Badge
            text={item.role === "admin" ? "Administrador" : "Membro"}
            variant={item.role === "admin" ? "info" : "outline"}
          />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Excluir ${item.name}`}
        className="h-10 w-10 items-center justify-center rounded-full bg-destructive/10"
        onPress={handleDelete}
      >
        <Trash2 size={18} className="text-destructive" />
      </Pressable>
    </TouchableOpacity>
  );
}
