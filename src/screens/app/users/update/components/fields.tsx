import { ControlledInput } from "@/components/form/controllers/input";
import { ControlledMaskInput } from "@/components/form/controllers/input-mask";
import { ControlledRadioGroup } from "@/components/form/controllers/radio-group";
import type { UserRole } from "@/domains/auth/types";
import { mask } from "@/utils/masks";
import { useFormContext } from "react-hook-form";

export interface UpdateUserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

const roleOptions = [
  { id: "admin", name: "Administrador" },
  { id: "member", name: "Membro" },
] satisfies { id: UserRole; name: string }[];

export function UpdateUserFields({ disabled }: { disabled: boolean }) {
  const { control } = useFormContext<UpdateUserFormData>();

  return (
    <>
      <ControlledInput
        control={control}
        name="name"
        label="Nome"
        placeholder="Nome completo"
        autoCapitalize="words"
        editable={!disabled}
        rules={{ required: "Informe o nome." }}
      />
      <ControlledInput
        control={control}
        name="email"
        label="E-mail"
        placeholder="usuario@exemplo.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!disabled}
        rules={{
          required: "Informe o e-mail.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Informe um e-mail válido.",
          },
        }}
      />
      <ControlledMaskInput
        control={control}
        name="phone"
        label="Telefone"
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        mask={mask.phoneMobile}
        editable={!disabled}
        rules={{
          required: "Informe o telefone.",
          minLength: {
            value: 10,
            message: "Informe um telefone válido.",
          },
        }}
      />
      <ControlledInput
        control={control}
        name="password"
        label="Nova senha"
        placeholder="Deixe em branco para manter a atual"
        secureTextEntry
        editable={!disabled}
        rules={{
          minLength: {
            value: 8,
            message: "A senha deve ter pelo menos 8 caracteres.",
          },
        }}
      />
      <ControlledRadioGroup
        control={control}
        name="role"
        label="Perfil"
        options={roleOptions}
        rules={{ required: "Selecione o perfil." }}
      />
    </>
  );
}
