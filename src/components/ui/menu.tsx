import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";

export interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  onPress: () => void;
  show: boolean;
}

interface MenuProps {
  actions: MenuItem[];
  customTrigger?: React.ReactNode;
}

export function Menu({ actions, customTrigger }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-10)).current;

  const toggleMenu = () => {
    if (!isOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        translateYAnim.setValue(-10);
      });
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    toggleMenu();
    action();
  };

  return (
    <View className="relative">
      {customTrigger ? (
        <TouchableOpacity onPress={toggleMenu}>
          {customTrigger}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={toggleMenu}>
          <View className="h-10 w-10 items-center justify-center rounded-full">
            <Icon name="ellipsis-vertical" size={22} className="text-white" />
          </View>
        </TouchableOpacity>
      )}
      {isOpen && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 4,
          }}
          className="absolute right-0 top-16 z-50 w-56 rounded-2xl border border-border bg-surface"
        >
          {actions.map((action, index) => (
            <Pressable
              key={action.id}
              onPress={() => handleAction(action.onPress)}
              className={`flex-row items-center px-4 py-3 ${index === actions.length - 1 ? "border-0" : "border-b border-border"}`}
            >
              <Icon
                name={action.icon}
                size={18}
                className="mr-3 text-primary"
              />
              <Text className="flex-1 text-foreground" numberOfLines={2}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}
