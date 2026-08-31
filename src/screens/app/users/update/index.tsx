import { GlobalForm } from "@/components/form/global-form/global-form";
import { MainHeader } from "@/components/layout/main-header";
import { FormScreen } from "@/components/layout/screens/form";
import { Screen } from "@/components/layout/screens/screen";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { getUserById, updateUser } from "@/domains/users/requests";
import type { UpdateUser as UpdateUserPayload } from "@/domains/users/types";
import { useAction } from "@/hooks/use-action";
import { queryKeys } from "@/lib/tanstack-query/keys";
import { invalidateQuery } from "@/lib/tanstack-query/methods";
import type { AppScreenProps } from "@/routes/types";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { UpdateUserFields, type UpdateUserFormData } from "./components/fields";

export function UpdateUser({
  navigation,
  route,
}: AppScreenProps<"UserUpdate">) {
  const { userId } = route.params;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUserById(userId),
  });
  const { mutateAsync: update, isPending } = useAction({
    mutationFn: (body: UpdateUserPayload) => updateUser(userId, body),
    successMessage: "Usuário atualizado com sucesso",
    onSuccess: async () => {
      await Promise.all([
        invalidateQuery(queryKeys.users.lists()),
        invalidateQuery(queryKeys.users.detail(userId)),
      ]);
      navigation.goBack();
    },
  });

  if (isLoading) {
    return (
      <Screen
        title="Editar usuário"
        canGoBack={navigation.canGoBack()}
        onBackPress={navigation.goBack}
        contentSize="form"
        header={<MainHeader />}
      >
        <View className="gap-5">
          <Skeleton height={68} borderRadius={14} />
          <Skeleton height={68} borderRadius={14} />
          <Skeleton height={68} borderRadius={14} />
          <Skeleton height={68} borderRadius={14} />
        </View>
      </Screen>
    );
  }

  const user = data;

  if (isError || !user) {
    return (
      <Screen
        title="Editar usuário"
        canGoBack={navigation.canGoBack()}
        onBackPress={navigation.goBack}
        contentSize="form"
        center
      >
        <View className="w-full gap-4 rounded-2xl border border-border bg-surface p-5">
          <Text className="text-center text-description">
            Não foi possível carregar o usuário.
          </Text>
          <Button
            title="Tentar novamente"
            variant="outline"
            onPress={() => refetch()}
          />
        </View>
      </Screen>
    );
  }

  const initialData: UpdateUserFormData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: "",
    role: user.role,
  };

  const onSubmit = async (values: UpdateUserFormData) => {
    await update({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone,
      role: values.role,
      ...(values.password ? { password: values.password } : {}),
    });
  };

  return (
    <FormScreen
      title="Editar usuário"
      description="Atualize os dados cadastrais ou o perfil de acesso."
      contentSize="form"
    >
      <GlobalForm<UpdateUserFormData>
        key={user.id}
        initialData={initialData}
        onSubmit={onSubmit}
        buttonTitle="Salvar alterações"
        scrollable
        isUpdate
      >
        <UpdateUserFields disabled={isPending} />
      </GlobalForm>
    </FormScreen>
  );
}
