import { ScrollableScreen } from "@/components/layout/screens/scrollable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfflineDataUnavailable } from "@/components/ui/offline-data-unavailable";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { getUserById } from "@/domains/users/requests";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@/hooks/use-query";
import { queryKeys } from "@/lib/tanstack-query/keys";
import type { AppScreenProps } from "@/routes/types";
import { formatDate } from "@/utils/date";
import { formatPhone } from "@/utils/masks";
import { CircleAlert, SquarePen, UserRound } from "lucide-react-native";
import { UserDetailsLoading } from "./components/loading";
import { DetailRow } from "./components/row";
import { DetailSection } from "./components/section";

export function UserDetails({
  navigation,
  route,
}: AppScreenProps<"UserDetails">) {
  const { userId } = route.params;
  const { colors } = useTheme();
  const {
    data: user,
    isLoading,
    isError,
    fetchStatus,
    refetch,
  } = useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUserById(userId),
  });
  const screenProps = {
    title: "Detalhes do usuário",
    canGoBack: navigation.canGoBack(),
    onBackPress: navigation.goBack,
  };

  if (fetchStatus === "paused" && !user) {
    return (
      <ScrollableScreen {...screenProps}>
        <OfflineDataUnavailable />
      </ScrollableScreen>
    );
  }

  if (isLoading) {
    return (
      <ScrollableScreen {...screenProps}>
        <UserDetailsLoading />
      </ScrollableScreen>
    );
  }

  if (isError || !user) {
    return (
      <ScrollableScreen {...screenProps} center>
        <View className="items-center gap-4">
          <CircleAlert size={48} color={colors.destructive} />
          <Text className="text-center text-description">
            Não foi possível carregar os detalhes do usuário.
          </Text>
          <Button title="Tentar novamente" onPress={() => refetch()} />
        </View>
      </ScrollableScreen>
    );
  }

  return (
    <ScrollableScreen {...screenProps}>
      <View className="items-center gap-3 rounded-xl border border-border bg-surface p-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <UserRound size={28} color={colors.primary} />
        </View>
        <Text className="text-center font-bold text-2xl" selectable>
          {user.name}
        </Text>
        <Text className="text-center text-description" selectable>
          {user.email}
        </Text>
        <Badge
          text={user.role === "admin" ? "Administrador" : "Membro"}
          variant={user.role === "admin" ? "info" : "outline"}
        />
      </View>

      <DetailSection title="Dados pessoais">
        <DetailRow label="Nome" value={user.name} />
        <DetailRow label="E-mail" value={user.email} />
        <DetailRow label="Telefone" value={formatPhone(user.phone)} />
        <DetailRow
          label="Perfil"
          value={user.role === "admin" ? "Administrador" : "Membro"}
          last
        />
      </DetailSection>

      <DetailSection title="Registro">
        <DetailRow label="ID" value={user.id} />
        <DetailRow label="Tenant ID" value={user.tenantId} />
        <DetailRow
          label="Criado em"
          value={formatDate(user.createdAt, "dd/MM/yyyy 'às' HH:mm")}
        />
        <DetailRow
          label="Atualizado em"
          value={formatDate(user.updatedAt, "dd/MM/yyyy 'às' HH:mm")}
          last
        />
      </DetailSection>

      <Button
        title="Editar usuário"
        leftIcon={<SquarePen size={18} color={colors.white} />}
        onPress={() =>
          navigation.navigate("UserUpdate", {
            userId,
          })
        }
      />
    </ScrollableScreen>
  );
}
