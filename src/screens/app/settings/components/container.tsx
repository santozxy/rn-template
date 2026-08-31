import React from "react";
import { Pressable } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export function Container({ children, onPress }: ContainerProps) {
  return (
    <Pressable
      className="h-14 flex-row items-center gap-4 rounded-lg px-4"
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
