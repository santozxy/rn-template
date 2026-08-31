import { ControlledSelect } from "@/components/form/controllers/select";
import { ControlledTextArea } from "@/components/form/controllers/textarea";
import { ReportProblemForm } from "@/domains/settings/types";
import { useFormContext } from "react-hook-form";

export function ReportForm() {
  const { control } = useFormContext<ReportProblemForm>();
  return (
    <>
      <ControlledSelect
        name="category"
        control={control}
        label="Categoria"
        placeholder="Selecione a categoria"
        rules={{
          required: "Selecione a categoria",
        }}
        data={[
          { name: "Bug", id: "Bug" },
          { name: "Sugestão", id: "Sugestão" },
          { name: "Outro", id: "Outro" },
        ]}
      />
      <ControlledTextArea
        name="description"
        control={control}
        label="Descrição"
        placeholder="Descreva o problema ou sugestão"
        rules={{
          required: "A descrição é obrigatória",
        }}
        maxLength={120}
      />
    </>
  );
}
