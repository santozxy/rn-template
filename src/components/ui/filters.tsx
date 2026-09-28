import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { View } from "@/components/ui/view";

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
        <Button
          variant="unstyled"
          size="content"
          key={opt.id}
          accessibilityState={{ selected: selected === opt.id }}
          onPress={() => onSelect(opt.id)}
        >
          <Badge
            text={opt.name}
            variant={selected === opt.id ? "default" : "secondary"}
          />
        </Button>
      ))}
    </View>
  );
}
