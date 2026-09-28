import { images } from "@/assets";
import { Screen } from "@/components/layout/screens/screen";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import { AuthScreenProps } from "@/routes/types";
import { useState } from "react";

const slides = [
  {
    title: "Bem-vindo(a) ao Fleet Tracker",
    description: "Controle sua frota e tome decisões com mais segurança.",
    images: {
      light: images.onboardingLight,
      dark: images.onboardingDark,
    },
  },
];

export function Onboarding({ navigation }: AuthScreenProps<"Onboarding">) {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <Screen contentSize="form">
      <View className="flex-row items-center justify-between">
        <Text className="text-foreground">{slide.title}</Text>
        {!isLastSlide && (
          <Button
            onPress={() => navigation.navigate("Login")}
            variant="muted"
            size="sm"
          >
            Pular
          </Button>
        )}
      </View>
      <Text className="font-bold text-2xl text-foreground">
        {slide.description}
      </Text>
      <Image
        source={slide.images[theme]}
        className="h-[28rem] w-full rounded-[36px]"
        contentPosition="bottom"
      />
      <View className="mt-6 flex-row items-center justify-center gap-2">
        {slides.map((_, index) => (
          <View
            key={index}
            className={` h-2 rounded-full ${
              currentSlide === index ? "w-8 bg-primary" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>

      <Button
        className="mt-6"
        onPress={() => {
          if (!isLastSlide) {
            setCurrentSlide(currentSlide + 1);
          } else {
            navigation.navigate("Login");
          }
        }}
      >
        {isLastSlide ? "Começar" : "Próximo"}
      </Button>
    </Screen>
  );
}
