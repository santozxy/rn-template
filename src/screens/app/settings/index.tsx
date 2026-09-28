import { MainHeader } from "@/components/layout/main-header";
import { ScrollableScreen } from "@/components/layout/screens/scrollable";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { View } from "@/components/ui/view";
import { useAuth } from "@/hooks/use-auth";
import { AppScreenProps } from "@/routes/types";
import {
  Bell,
  Lock,
  LogOut,
  Palette,
  TriangleAlert,
} from "lucide-react-native";
import { Container } from "./components/container";
import { ThemeSelector } from "./components/theme-selector";
import { ToggleNotification } from "./components/toggle-notification";

export function Settings({ navigation }: AppScreenProps<"Settings">) {
  const { logout } = useAuth();

  return (
    <ScrollableScreen header={<MainHeader />}>
      <View className="flex-1 gap-4 bg-background py-6">
        <Title className="font-semibold">Ajustes</Title>
        <Container>
          <Bell className="h-6 w-6 text-warning" />
          <Text className="text-foreground">Receber notificações</Text>
          <View className="flex-1" />
          <ToggleNotification />
        </Container>
        <Container>
          <Palette className="h-6 w-6 text-primary" />
          <Text className="text-foreground">Tema</Text>
          <View className="flex-1" />
          <ThemeSelector />
        </Container>
        <Title className="font-semibold">Outros</Title>
        <Container onPress={() => {}}>
          <TriangleAlert className="h-6 w-6 text-warning" />
          <Text className="text-foreground">Informe um problema</Text>
        </Container>
        <Container onPress={() => {}}>
          <Lock className="h-6 w-6 text-success" />
          <Text className="text-foreground">Política de privacidade</Text>
        </Container>

        <Container onPress={logout}>
          <LogOut className="h-6 w-6 text-destructive" />
          <Text className="text-foreground">Sair</Text>
        </Container>
      </View>
    </ScrollableScreen>
  );
}
