import { GlobalForm } from "@/components/form/global-form/global-form";
import { FormScreen } from "@/components/layout/screens/form";
import { createUser } from "@/domains/users/requests";
import type { CreateUser as CreateUserPayload } from "@/domains/users/types";
import { useAction } from "@/hooks/use-action";
import { queryKeys } from "@/lib/tanstack-query/keys";
import { invalidateQuery } from "@/lib/tanstack-query/methods";
import type { AppScreenProps } from "@/routes/types";
import { CreateUserFields, type CreateUserFormData } from "./components/fields";

const initialData: CreateUserFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "member",
};

export function CreateUser({ navigation }: AppScreenProps<"UserCreate">) {
  const { mutateAsync: create, isPending } = useAction({
    mutationFn: (body: CreateUserPayload) => createUser(body),
    successMessage: "Usuário criado com sucesso",
    onSuccess: async () => {
      await invalidateQuery(queryKeys.users.lists());
      navigation.goBack();
    },
    invalidateQueries: [queryKeys.users.lists()],
  });

  const onSubmit = async (values: CreateUserFormData) => {
    await create({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone,
      password: values.password,
      role: values.role,
    });
  };

  return (
    <FormScreen
      title="Novo usuário"
      description="Cadastre os dados de acesso e o perfil do usuário."
      contentSize="form"
    >
      <GlobalForm<CreateUserFormData>
        initialData={initialData}
        onSubmit={onSubmit}
        buttonTitle="Cadastrar usuário"
        scrollable
      >
        <CreateUserFields disabled={isPending} />
      </GlobalForm>
    </FormScreen>
  );
}
