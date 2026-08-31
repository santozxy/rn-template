import { View } from "react-native";
import React from "react";
import { Badge } from "./badge";
import { BadgeVariant } from "@/theme/variants/badge";

interface TagsProps {
  tags: { id: string; name: string }[];
  variant?: BadgeVariant;
  limit?: number;
}

export function Tags({ tags, variant = "default", limit }: TagsProps) {
  const showTags = limit ? tags.slice(0, limit) : tags;
  const hasMore = limit ? tags.length > limit : false;

  return (
    <View className="flex-row flex-wrap gap-1.5">
      {showTags.map((tag) => (
        <Badge key={tag.id} text={tag.name} variant={variant} />
      ))}

      {hasMore && <Badge key="more" text="..." variant={variant} />}
    </View>
  );
}
