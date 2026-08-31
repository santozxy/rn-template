import { Pressable, View } from "react-native";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Option {
  id: string;
  name: string;
}

interface FiltersProps {
  onSelect: (type: string) => void;
  selected: string | number;
  options: Option[];
}

export function Filters({ onSelect, selected, options }: FiltersProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => (
        <Pressable key={opt.id} onPress={() => onSelect(opt.id)}>
          <Badge
            text={opt.name}
            variant={selected === opt.id ? "default" : "secondary"}
          />
        </Pressable>
      ))}
    </View>
  );
}
