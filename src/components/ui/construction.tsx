import { animations } from "@/assets";
import LottieView from "lottie-react-native";
import { Text } from "./text";
import { View } from "./view";

export function Construction() {
  return (
    <View className="flex-col items-center justify-center">
      <Text className="font-bold text-2xl text-description">
        Em desenvolvimento...
      </Text>
      <LottieView
        autoPlay
        style={{
          width: 300,
          height: 300,
        }}
        source={animations.construction}
      />
    </View>
  );
}
