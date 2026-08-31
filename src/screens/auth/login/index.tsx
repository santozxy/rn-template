import { ControlledInput } from "@/components/form/controllers/input";
import { FormScreen } from "@/components/layout/screens/form";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { developmentCredentials, login } from "@/domains/auth/requests";
import type { Auth, Credentials } from "@/domains/auth/types";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ShieldCheck } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";

export function Login() {
  const { saveAuth } = useAuth();
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm<Credentials>({
    defaultValues: { email: "", password: "" },
  });
  const { mutateAsync, isPending } = useAction<Credentials, Auth>({
    mutationFn: login,
    disableSuccessToast: true,
    onSuccess: async ({ data }) => saveAuth(data),
  });

  const onSubmit = async (credentials: Credentials) => {
    Keyboard.dismiss();
    await mutateAsync({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });
  };

  return (
    <FormScreen>
      <View className="items-center gap-4">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-light">
          <ShieldCheck color={colors.primary} size={42} strokeWidth={1.8} />
        </View>
        <View className="items-center gap-2">
          <Text className="text-center font-bold text-3xl" selectable>
            Bem-vindo(a)
          </Text>
          <Text className="text-center text-description" selectable>
            Entre com seu e-mail e senha para acessar o aplicativo.
          </Text>
        </View>
      </View>
      <View className="gap-5 rounded-3xl border border-border bg-surface p-5">
        <ControlledInput
          control={control}
          name="email"
          label="E-mail"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Informe seu e-mail"
          returnKeyType="next"
          rules={{
            required: "Informe o e-mail.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Informe um e-mail válido.",
            },
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
        <Button
          title="Entrar"
          size="lg"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <View className="items-center gap-1 rounded-2xl bg-primary-light p-4">
        <Text className="text-sm text-description" selectable>
          Acesso criado pelo seed do nest-template
        </Text>
        <Text className="font-semibold text-primary" selectable>
          {developmentCredentials.email} / {developmentCredentials.password}
        </Text>
      </View>
    </FormScreen>
  );
}
