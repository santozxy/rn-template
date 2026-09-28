import { api } from "@/api/config";
import { images } from "@/assets";
import { ControlledInput } from "@/components/form/controllers/input";
import { FormScreen } from "@/components/layout/screens/form";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { login } from "@/domains/auth/requests";
import type { Auth, Credentials } from "@/domains/auth/types";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const defaultValues: Credentials = {
  email: "admin.syslae",
  password: "Admin@123",
};

export function Login() {
  const { saveAuth } = useAuth();
  const isDev = api.isLocal || api.isDemo;
  const { control, handleSubmit } = useForm<Credentials>({
    defaultValues: isDev ? defaultValues : undefined,
  });
  const { mutateAsync, isPending } = useAction<Credentials, Auth>({
    mutationFn: login,
    disableSuccessToast: true,
    onSuccess: async ({ data }) => saveAuth(data),
    disableErrorToast: false,
  });

  const onSubmit = async (credentials: Credentials) => {
    Keyboard.dismiss();
    await mutateAsync({
      email: credentials.email.trim(),
      password: credentials.password,
    });
  };

  return (
    <FormScreen contentSize="form">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerClassName="gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-6">
          <Image
            source={images.logo}
            className="h-40 w-80"
            contentFit="contain"
          />
          <View className="items-center gap-2">
            <Text className="text-center font-bold text-3xl" selectable>
              Olá, seja bem-vindo(a)
            </Text>
            <Text className="text-center text-description" selectable>
              Faça login na sua conta.
            </Text>
          </View>
        </View>
        <ControlledInput
          control={control}
          name="email"
          label="Nome de usuário"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Informe seu e-mail"
          returnKeyType="next"
          rules={{
            required: "Informe o nome de usuário.",
          }}
        />

        <ControlledInput
          control={control}
          name="password"
          label="Senha"
          placeholder="Informe sua senha"
          secureTextEntry
          returnKeyType="done"
          rules={{ required: "Informe a senha." }}
          onSubmitEditing={handleSubmit(onSubmit)}
        />
        <Button size="lg" loading={isPending} onPress={handleSubmit(onSubmit)}>
          Entrar
        </Button>
        <Button
          size="lg"
          variant="light"
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
        >
          Esqueci minha senha
        </Button>
      </KeyboardAwareScrollView>
    </FormScreen>
  );
}
