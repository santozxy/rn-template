import { MainHeader } from "@/components/layout/main-header";
import { ScrollableScreen } from "@/components/layout/screens/scrollable";
import { Text } from "@/components/ui/text";
import { Layers3, Route, Users } from "lucide-react-native";
import { View } from "react-native";
import { FeatureCard } from "./components/feature-card";

const features = [
  {
    description: "Login e CRUD conectados diretamente ao nest-template.",
    icon: Users,
    title: "Usuários",
  },
  {
    description: "Fluxos público e privado separados em stacks tipados.",
    icon: Route,
    title: "React Navigation",
  },
  {
    description: "Tema, sessão, rede, queries, upload e toasts compostos.",
    icon: Layers3,
    title: "Providers",
  },
];

export function Home() {
  return (
    <ScrollableScreen header={<MainHeader />}>
      <View className="gap-2">
        <Text className="font-bold text-3xl" selectable>
          Template pronto para evoluir
        </Text>
        <Text className="text-description" selectable>
          A base essencial do meu-e-gov com navegação tipada por stacks.
        </Text>
      </View>
      <View className="gap-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </View>
    </ScrollableScreen>
  );
}
