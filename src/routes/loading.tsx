import { animations } from "@/assets";
import { Animation } from "@/components/ui/animation";
import type { LottieViewProps } from "lottie-react-native";
import { View } from "react-native";

type LoadingScreenProps = Pick<LottieViewProps, "onAnimationFinish">;

export function LoadingScreen({ onAnimationFinish }: LoadingScreenProps = {}) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Animation
        source={animations.init}
        style={{
          width: 500,
          maxWidth: 500,
          height: 526,
          aspectRatio: 247 / 113,
        }}
        autoPlay
        loop={false}
        resizeMode="contain"
        onAnimationFinish={onAnimationFinish}
        onAnimationFailure={(error) => console.error("Animation error:", error)}
      />
    </View>
  );
}
