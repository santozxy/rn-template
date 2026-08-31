import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface HeaderProps<T extends string> {
  title: string;
  setActiveTab: (tab: T) => void;
  activeTab: T;
  rightComponent?: React.ReactNode;
  routes?: {
    key: T;
    titleKey: string;
  }[];
}

export function Header<T extends string>({
  title,
  setActiveTab,
  activeTab,
  rightComponent,
  routes,
}: HeaderProps<T>) {
  const navigation = useNavigation();

  return (
    <View className="flex-col">
      <View className="z-50 h-20 flex-row items-center justify-between bg-primary px-4">
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-1 flex-row items-center gap-3"
          >
            <Icon
              name="arrow-back"
              size={30}
              className="items-start color-primary-foreground"
            />
            <Text
              className="mr-5 flex-1 font-semibold text-lg text-primary-foreground"
              numberOfLines={1}
            >
              {title}
            </Text>
          </TouchableOpacity>
        </View>
        {rightComponent}
      </View>

      <View className="flex-row items-center gap-2 bg-primary">
        {routes?.map((route) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => setActiveTab(route.key)}
            className={`flex-1 border-b-2 px-3 pb-3 ${
              route.key === activeTab
                ? "border-primary-foreground"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                route.key === activeTab
                  ? "text-primary-foreground"
                  : "text-primary-foreground/70"
              }`}
            >
              {route.titleKey}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
