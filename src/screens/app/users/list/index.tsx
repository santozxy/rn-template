import { MainHeader } from "@/components/layout/main-header";
import { Screen } from "@/components/layout/screens/screen";
import { ListPaginated } from "@/components/list/list-paginated";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { deleteUser, getUsers } from "@/domains/users/requests";
import type { User } from "@/domains/users/types";
import { useAction } from "@/hooks/use-action";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { queryKeys } from "@/lib/tanstack-query/keys";
import { invalidateQuery } from "@/lib/tanstack-query/methods";
import type { AppTabScreenProps } from "@/routes/types";
import { useCallback, useState } from "react";
import { UserItem } from "./item";
import { LoadingUsers } from "./loading";

const listParams = { perPage: 20 };

export function Users({ navigation }: AppTabScreenProps<"Users">) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const usersQuery = usePaginatedList<User>({
    queryKey: queryKeys.users.list(listParams),
    queryFn: ({ page }) => getUsers({ page, ...listParams }),
  });
  const { mutateAsync: remove, isPending: isDeleting } = useAction({
    mutationFn: (id: string) => deleteUser(id),
    successMessage: "Usuário excluído com sucesso",
    onSuccess: async () => {
      await invalidateQuery(queryKeys.users.lists());
    },
  });

  const goToDetails = useCallback(
    (user: User) => {
      navigation.navigate("UserDetails", { userId: user.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <UserItem item={item} onPress={goToDetails} onDelete={setSelectedUser} />
    ),
    [goToDetails],
  );

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await remove(selectedUser.id);
      setSelectedUser(null);
    } catch {
      return;
    }
  };

  return (
    <Screen title="Usuários" header={<MainHeader />}>
      <View className="flex-row items-center justify-between">
        <Text className=" text-gray-500 dark:text-gray-400">
          Gerencie os usuários do sistema
        </Text>
        <Button
          onPress={() => navigation.navigate("UserCreate")}
          title="Novo usuário"
          size="sm"
        />
      </View>
      <ListPaginated
        data={usersQuery.items}
        renderItem={renderItem}
        isLoading={usersQuery.isLoading}
        isRefetching={usersQuery.isRefetching}
        isFetchingNextPage={usersQuery.isFetchingNextPage}
        isOfflineUnavailable={usersQuery.isOfflineUnavailable}
        hasNextPage={usersQuery.hasNextPage}
        fetchNextPage={usersQuery.fetchNextPage}
        onRefresh={usersQuery.refetch}
        loadingComponent={<LoadingUsers />}
        emptyText="Nenhum usuário cadastrado"
        emptyIconName="account-off-outline"
      />
      <Dialog
        show={Boolean(selectedUser)}
        variant="destructive"
        title="Excluir usuário"
        description={`Deseja excluir o usuário "${selectedUser?.name ?? ""}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={isDeleting}
        onCancel={() => setSelectedUser(null)}
        onConfirm={confirmDelete}
      />
    </Screen>
  );
}
