import { GlobalForm } from "@/components/form/global-form/global-form";
import { ScrollableScreen } from "@/components/layout/screens/scrollable";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { ReportProblemForm } from "@/domains/settings/types";
import { toast } from "@/lib/toast";
import { AppScreenProps } from "@/routes/types";
import { logger } from "logger";
import React from "react";
import { ReportForm } from "./components/report-form";
import { sendReportMessage } from "./helpers";

export function ReportProblems({
  navigation,
}: AppScreenProps<"ReportProblems">) {
  const handleSubmit = async (data: ReportProblemForm) => {
    try {
      await sendReportMessage(data);
      navigation.goBack();
    } catch (error) {
      logger.error("Erro ao enviar relatório de problemas", error);
      toast.error("Ocorreu um erro ao enviar o relatório. Tente novamente.");
    }
  };

  return (
    <ScrollableScreen title="Reportar Problemas">
      <View className="flex-col gap-4">
        <Text className="text-description">
          Se você encontrou algum problema ou tem uma sugestão para melhorar o
          aplicativo, por favor, utilize o formulário abaixo para nos informar.
        </Text>
      </View>
      <GlobalForm
        onSubmit={handleSubmit}
        buttonTitle="Enviar"
        requiresConnection={false}
      >
        <ReportForm />
      </GlobalForm>
    </ScrollableScreen>
  );
}
