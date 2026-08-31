import { ReportProblemForm } from "@/domains/settings/types";
import { Linking } from "react-native";

export async function sendReportMessage(data: ReportProblemForm) {
  const message = `
📱 *MEU E-GOV – Relato de Problema*

👋 Olá! Tudo bem?
Estou entrando em contato para relatar um problema encontrado no aplicativo *MEU E-GOV*.

🗂️ *Categoria:*
${data.category}

📝 *Descrição:*
${data.description}

🙏 Agradeço a atenção e fico no aguardo de um retorno.
`;
  const url = `whatsapp://send?phone=558630850506&text=${encodeURIComponent(
    message.trim(),
  )}`;

  await Linking.openURL(url);
}
