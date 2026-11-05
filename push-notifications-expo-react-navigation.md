# Push notifications com Expo Notifications e React Navigation

Este guia descreve uma implementação reutilizável de notificações push em aplicativos Expo/React Native que usam React Navigation. O envio usa o Expo Push Service, com FCM V1 no Android e APNs no iOS.

Os exemplos usam Expo SDK 56 e React Navigation 7. Em outro projeto, consulte a documentação correspondente à versão instalada antes de copiar o código.

Última atualização: 4 de novembro de 2026.

## 1. Arquitetura do fluxo

```text
Usuário habilita a preferência no app
        ↓
App solicita a permissão do sistema operacional
        ↓
App obtém um ExpoPushToken e registra a instalação na API
        ↓
Backend salva a preferência do usuário e o token do dispositivo
        ↓
Um evento de domínio acontece, por exemplo: ignição desligada → ligada
        ↓
Backend encontra os usuários autorizados e seus dispositivos habilitados
        ↓
Backend envia a mensagem ao Expo Push Service
        ↓
Expo entrega por FCM V1 no Android ou APNs no iOS
        ↓
Ao tocar na notificação, a URL do payload é processada pelo React Navigation
```

Separe sempre as responsabilidades:

- O app solicita permissão, registra o dispositivo e controla o opt-in.
- O backend decide quem pode receber e quando o evento deve gerar notificação.
- O Expo Push Service faz a ponte com FCM e APNs.
- O React Navigation transforma a URL recebida na tela correta.

Não coloque a regra de negócio do destinatário somente no aplicativo. O backend precisa validar novamente papel, vínculo, preferência e estado do dispositivo no momento do envio.

## 2. Pré-requisitos

- Projeto Expo vinculado a uma conta Expo/EAS.
- Aplicativo Android criado no Firebase com o mesmo `package` do app.
- App ID na Apple com o mesmo `bundleIdentifier` e Push Notifications habilitado.
- Backend autenticado e acessível por HTTPS.
- Dispositivo ou ambiente que suporte push.

Notificação remota não deve ser validada somente no Expo Go. No Android, desde o SDK 53, ela exige development build ou build nativo. Para validar o fluxo real, use um development build ou um build de distribuição.

## 3. Instalar as dependências

Use `expo install` para receber versões compatíveis com o SDK do projeto:

```bash
bunx expo install expo-notifications expo-device expo-constants
```

O React Navigation deve estar configurado no projeto. No mínimo:

```bash
bunx expo install @react-navigation/native react-native-screens react-native-safe-area-context
```

Instale também o navigator usado pelo aplicativo, como `@react-navigation/native-stack`.

## 4. Configurar o app

Exemplo de `app.json`:

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "scheme": "my-app",
    "ios": {
      "bundleIdentifier": "com.example.myapp",
      "entitlements": {
        "aps-environment": "production"
      }
    },
    "android": {
      "package": "com.example.myapp",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "defaultChannel": "default"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "SEU_EAS_PROJECT_ID"
      }
    }
  }
}
```

Observações:

- `scheme` será usado em URLs como `my-app://vehicles/123`.
- `package` deve ser exatamente igual ao aplicativo Android cadastrado no Firebase.
- `bundleIdentifier` deve ser exatamente igual ao App ID cadastrado na Apple.
- `projectId` identifica o projeto EAS usado para gerar o `ExpoPushToken`.
- Configurações de plugin são aplicadas ao recompilar o app nativo; reiniciar somente o Metro não é suficiente.

Se o projeto mantém as pastas `android/` e `ios/` no repositório, verifique também o resultado nativo:

- iOS: o arquivo de entitlements precisa conter `aps-environment`.
- Android: `google-services.json` precisa estar no caminho configurado e o Google Services precisa estar aplicado ao app.
- Android 13+: a permissão `POST_NOTIFICATIONS` precisa existir no manifesto final.

Não execute `expo prebuild --clean` sem revisar as customizações nativas, pois ele recria as pastas nativas.

## 5. Vincular o projeto ao EAS

```bash
bunx eas-cli@latest login
bunx eas-cli@latest whoami
bunx eas-cli@latest init
```

Cada comando tem uma responsabilidade diferente:

- `eas init` cria ou vincula o projeto EAS e preenche o `extra.eas.projectId`.
- `eas credentials` administra as credenciais nativas de cada plataforma.

Mesmo sem usar Expo Build, o EAS CLI pode exigir um `eas.json` para resolver o perfil usado pelo comando `eas credentials`. Deixe na raiz do app, ao lado do `package.json`, somente a configuração mínima:

```json
{
  "build": {
    "production": {}
  }
}
```

Esse perfil existe apenas para o EAS CLI localizar a configuração ao administrar FCM e APNs. Ele não obriga o projeto a usar `eas build`; os APKs, AABs e archives iOS podem continuar sendo gerados pelos projetos nativos.

Confirme o `projectId` no app config resolvido:

```bash
bunx expo config --type public
```

O `projectId` não é uma credencial secreta. A chave privada do Firebase e o `.p8` da Apple são secretos.

Se aparecer `eas.json could not be found` ou `eas.json is empty`, crie o arquivo mínimo acima. Não é necessário configurar ambientes ou perfis de build quando o projeto usa somente os projetos nativos para compilar.

## 6. Configurar Android com Firebase e FCM V1

1. Crie ou abra o projeto no Firebase Console.
2. Cadastre um aplicativo Android usando o `android.package` exato.
3. Baixe o `google-services.json` e coloque-o no caminho configurado no `app.json`.
4. Em Google Cloud/Firebase, confirme que a API Firebase Cloud Messaging está habilitada.
5. Em **Configurações do projeto → Contas de serviço**, gere uma chave privada JSON para uma conta de serviço autorizada a enviar mensagens FCM V1.
6. Envie essa chave ao EAS:

```bash
bunx eas-cli@latest credentials -p android
```

No menu, selecione o perfil desejado e depois:

```text
Android
→ production
→ Google Service Account
→ Manage your Google Service Account Key for Push Notifications (FCM V1)
→ Set up a Google Service Account Key for Push Notifications (FCM V1)
→ Upload a new service account key
```

Quando o EAS detectar arquivos JSON, selecione a chave privada gerada em **Firebase Console → Configurações do projeto → Contas de serviço → Gerar nova chave privada**. O nome costuma conter `firebase-adminsdk`.

Não confunda as opções do menu Android:

| Opção                              | Serve para                                   | Escolher para push?                                 |
| ---------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Android Keystore                   | Assinar APK/AAB                              | Não, a menos que também esteja configurando o build |
| Google Service Account para FCM V1 | Autorizar o Expo a enviar push pelo Firebase | **Sim**                                             |
| Google Play service account        | Enviar AAB para a Play Store                 | Não                                                 |
| FCM legacy/server key              | Protocolo antigo                             | Não para uma integração nova                        |

Para este tutorial, a opção correta é sempre a conta de serviço **FCM V1**. A conta de serviço da Google Play é outra credencial, mesmo que ambas sejam arquivos JSON.

Existem dois arquivos diferentes:

- `google-services.json`: configuração pública do cliente Android; normalmente fica no projeto.
- JSON da conta de serviço: chave privada usada pelo serviço de envio; nunca deve ser versionada.

Adicione qualquer chave privada temporariamente baixada ao `.gitignore` e remova a cópia local quando terminar o upload seguro.

Exemplo de proteção:

```gitignore
*.p8
*-firebase-adminsdk-*.json
google-service-account*.json
```

Não ignore genericamente todo arquivo chamado `google-services.json`: ele é a configuração do cliente Android e precisa estar disponível durante o build. A chave `firebase-adminsdk` é diferente e deve permanecer secreta.

## 7. Configurar iOS com APNs

1. No Apple Developer, crie ou abra o App ID correspondente ao `ios.bundleIdentifier`.
2. Habilite a capability **Push Notifications**.
3. Use uma APNs Auth Key (`AuthKey_XXXXXXXXXX.p8`) que possua permissão de push.
4. Tenha em mãos:
   - arquivo `.p8`;
   - Key ID;
   - Apple Team ID.
5. Envie a chave ao EAS:

```bash
bunx eas-cli@latest credentials -p ios
```

No menu, escolha aproximadamente este caminho; o texto pode variar um pouco conforme a versão do EAS CLI:

```text
iOS
→ production
→ Push Notifications
→ Manage your Apple Push Notifications Key
→ Use/Add an existing Push Key
```

Como a chave `.p8` já existe, escolha usar uma chave existente e informe:

- caminho do arquivo `AuthKey_XXXXXXXXXX.p8`;
- Key ID, que corresponde ao trecho `XXXXXXXXXX` do nome da chave;
- Apple Team ID da conta desenvolvedora.

Não confunda as opções do menu iOS:

| Opção                        | Serve para                               | Escolher para push?                                 |
| ---------------------------- | ---------------------------------------- | --------------------------------------------------- |
| Distribution Certificate     | Assinar o aplicativo                     | Não, a menos que também esteja configurando o build |
| Provisioning Profile         | Autorizar o bundle/capabilities no build | Não diretamente                                     |
| Apple Push Notifications Key | Autorizar o envio pelo APNs              | **Sim**                                             |
| App Store Connect API Key    | Automatizar submissões/TestFlight        | Não                                                 |

Uma APNs Auth Key pode ser reutilizada entre vários aplicativos da mesma equipe Apple, conforme as permissões da chave. Se o EAS mostrar uma Push Key já cadastrada com o mesmo Team ID, prefira reutilizá-la em vez de criar outra sem necessidade.

Nunca versione o `.p8`. Depois de alterar capabilities ou credenciais, gere um novo build para que entitlements e provisioning profile sejam atualizados.

### Decisão rápida no `eas credentials`

Se o objetivo neste momento é somente habilitar notificações:

```text
Android → FCM V1 Google Service Account
iOS     → Apple Push Notifications Key
```

Keystore, Distribution Certificate e Provisioning Profile pertencem à assinatura do build. Google Play service account e App Store Connect API Key pertencem à submissão nas lojas. O EAS pode pedir essas outras credenciais mais tarde, quando você executar o primeiro build ou submissão; elas não substituem as credenciais de push.

## 8. Criar o canal e solicitar a permissão

Crie um módulo dedicado, por exemplo `src/services/push-notifications.ts`:

```ts
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DEFAULT_CHANNEL_ID = "default";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: "Notificações gerais",
    importance: Notifications.AndroidImportance.HIGH,
  });
}

async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function getProjectId(): string {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("EAS projectId não configurado.");
  }

  return projectId;
}

export async function getExpoPushToken(): Promise<string> {
  if (!Device.isDevice) {
    throw new Error("Use um dispositivo compatível para registrar push.");
  }

  await ensureAndroidChannel();

  const allowed = await requestNotificationPermission();
  if (!allowed) {
    throw new Error("Permissão de notificação não concedida.");
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: getProjectId(),
  });

  return token.data;
}
```

No Android 13+, o canal deve ser criado antes de solicitar o token, caso contrário o prompt de permissão pode não aparecer corretamente.

Trate falhas de rede ao obter o token. `getExpoPushTokenAsync` chama os servidores da Expo e pode falhar offline; tente sincronizar novamente mais tarde sem bloquear todo o uso do aplicativo.

## 9. Registrar a instalação no backend

O backend deve receber o token do usuário autenticado. Nunca aceite um `userId` arbitrário do cliente para definir o dono do token.

Contrato sugerido:

```http
GET /mobile/push-notifications/preferences
PATCH /mobile/push-notifications/preferences
PUT /mobile/push-notifications/devices
DELETE /mobile/push-notifications/devices/current
```

Exemplo do registro:

```ts
type RegisterPushDeviceInput = {
  token: string;
  platform: "ANDROID" | "IOS";
};

export async function registerCurrentDevice(): Promise<string> {
  const token = await getExpoPushToken();

  await api.put("/mobile/push-notifications/devices", {
    token,
    platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
  } satisfies RegisterPushDeviceInput);

  return token;
}
```

Modelo de dados sugerido:

```text
PushDevice
- id
- userId
- token (unique)
- platform
- enabled
- lastSeenAt
- createdAt
- updatedAt

User
- notificationsEnabled, ou uma preferência específica por evento
```

Um usuário pode ter mais de uma instalação. O token deve ser único globalmente e associado ao usuário autenticado que o registrou por último.

## 10. Implementar o opt-in corretamente

Não solicite a permissão assim que o app abrir sem contexto. Exiba uma opção explicando o benefício e solicite a permissão quando o usuário decidir habilitar.

Ao habilitar:

1. Solicite a permissão do sistema.
2. Obtenha o token.
3. Registre o dispositivo na API.
4. Somente depois marque a preferência do backend como habilitada.

Ao desabilitar:

1. Desabilite a preferência no backend.
2. Opcionalmente desabilite o token dessa instalação se nenhuma categoria puder mais ser recebida.
3. Não é necessário tentar remover a permissão do sistema; isso é controlado pelo usuário nas configurações do aparelho.

Se a permissão estiver negada e `canAskAgain` for `false`, não salve a preferência como habilitada. Mostre uma ação para abrir as configurações do aplicativo:

```ts
import { Linking } from "react-native";

await Linking.openSettings();
```

Ao fazer login, se a preferência já estiver habilitada, sincronize novamente o token. No logout, desabilite ou remova a instalação atual antes de apagar a sessão autenticada.

## 11. Sincronizar mudanças de token

O token nativo pode mudar enquanto o app está em execução. O listener do Expo recebe um token nativo; se o backend usa `ExpoPushToken`, gere e sincronize novamente o token Expo:

```ts
import * as Notifications from "expo-notifications";

export function subscribeToPushTokenChanges(
  syncExpoToken: () => Promise<void>,
): () => void {
  const subscription = Notifications.addPushTokenListener(() => {
    void syncExpoToken();
  });

  return () => subscription.remove();
}
```

Não chame `getDevicePushTokenAsync` dentro do listener, pois isso pode disparar o próprio listener novamente. A função `syncExpoToken` deve usar `getExpoPushTokenAsync`, registrar o resultado no backend e tratar a falha sem lançar erro não tratado.

## 12. Configurar deep links no React Navigation

Defina rotas e parâmetros de forma tipada:

```ts
export type RootStackParamList = {
  Home: undefined;
  VehicleDetails: { vehicleId: string };
  NotificationSettings: undefined;
};
```

Crie uma função que aceite somente URLs conhecidas. Não faça cast cego de `data.url`:

```ts
function readNotificationUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("my-app://")) return undefined;

  return value;
}
```

Configure o `linking` do `NavigationContainer`:

```ts
import type { LinkingOptions } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["my-app://"],
  config: {
    screens: {
      Home: "",
      VehicleDetails: "vehicles/:vehicleId",
      NotificationSettings: "settings/notifications",
    },
  },

  async getInitialURL() {
    const deepLinkUrl = await Linking.getInitialURL();
    if (deepLinkUrl) return deepLinkUrl;

    const response = await Notifications.getLastNotificationResponseAsync();
    return readNotificationUrl(response?.notification.request.content.data.url);
  },

  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener("url", ({ url }) =>
      listener(url),
    );

    const notificationSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = readNotificationUrl(
          response.notification.request.content.data.url,
        );

        if (url) listener(url);
      });

    return () => {
      linkingSubscription.remove();
      notificationSubscription.remove();
    };
  },
};
```

Passe o objeto ao container:

```tsx
<NavigationContainer linking={linking}>
  <RootNavigator />
</NavigationContainer>
```

Esse fluxo cobre os dois cenários importantes:

- App encerrado: `getInitialURL` consulta primeiro um deep link normal e depois a última interação com notificação.
- App aberto ou em segundo plano: `subscribe` escuta links e toques em notificações.

Evite navegar manualmente por uma `navigationRef` quando o objetivo é apenas interpretar URLs. O `linking` do React Navigation mantém o estado inicial e a navegação em execução sob a mesma configuração.

Se a rota exige autenticação, só monte o navigator autenticado depois que a sessão tiver sido hidratada. A URL pode ser obtida antes disso, mas a tela de destino precisa existir quando o React Navigation montar o estado correspondente.

## 13. Definir o payload da notificação

O backend deve mandar uma URL compatível com o `linking.config`:

```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Veículo ligado",
  "body": "O veículo ABC1D23 teve a ignição ligada.",
  "sound": "default",
  "priority": "high",
  "channelId": "default",
  "data": {
    "type": "VEHICLE_IGNITION_ON",
    "vehicleId": "vehicle-id",
    "url": "my-app://vehicles/vehicle-id"
  }
}
```

O `channelId` precisa corresponder ao canal criado no Android. Mantenha o payload pequeno e trate os dados como entrada não confiável no app.

## 14. Enviar pelo backend

Exemplo mínimo usando o Expo Push Service:

```ts
type ExpoPushMessage = {
  to: string;
  title: string;
  body: string;
  sound: "default";
  priority: "high";
  channelId: string;
  data: Record<string, string>;
};

export async function sendExpoPush(messages: ExpoPushMessage[]): Promise<void> {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  if (!response.ok) {
    throw new Error(`Expo Push Service respondeu ${response.status}.`);
  }

  const result: unknown = await response.json();
  // Valide e persista os tickets necessários para consultar os receipts.
  console.info(result);
}
```

Em produção:

- Valide o formato do `ExpoPushToken` antes do envio.
- Envie em lotes de no máximo 100 mensagens por requisição.
- Limite a concorrência e use retry com backoff para falhas transitórias.
- Guarde os IDs dos push tickets retornados.
- Consulte os push receipts depois.
- Ao receber `DeviceNotRegistered`, desabilite o token no banco.
- Não registre tokens completos em logs comuns.
- Se habilitar a segurança de acesso do projeto Expo, envie o access token no header `Authorization: Bearer ...` e mantenha-o somente no backend.

O sucesso da requisição de envio não confirma que a notificação chegou ao aparelho. O ticket confirma aceitação inicial; o receipt informa o resultado posterior do processamento.

## 15. Implementar regras de evento no backend

Notificação deve nascer de uma transição de estado, não de cada pacote recebido.

Para ignição:

```text
estado anterior = false
estado atual    = true
resultado       = enviar “ignição ligada”
```

Regras recomendadas:

- `null → true`: apenas inicializar o estado; não notificar, pois não há transição conhecida.
- `false → true`: notificar uma vez.
- `true → true`: ignorar duplicata.
- Pacote com timestamp anterior ao último processado: ignorar para a transição.
- Atualizar o último estado e o timestamp de forma consistente.

No momento do envio, consulte novamente os destinatários. Para o caso do Fleet Tracker:

- usuário ativo;
- papel `DRIVER`;
- preferência de ignição habilitada;
- motorista atualmente vinculado ao veículo;
- dispositivo habilitado.

Assim, apenas o motorista do veículo recebe o aviso, mesmo se o vínculo mudar depois que o token foi registrado.

## 16. Ordem segura de publicação

1. Publicar a migration do banco.
2. Publicar o backend com endpoints de preferência e dispositivo.
3. Configurar FCM V1 e APNs no EAS.
4. Gerar um novo build nativo.
5. Validar registro, opt-in e entrega em ambiente de teste.
6. Publicar o app.
7. Só então habilitar o disparo automático do evento em produção.

Essa ordem evita que o backend tente enviar antes de existirem usuários, tokens e builds corretamente configurados.

## 17. Testar

Primeiro teste o deep link sem push:

```bash
npx uri-scheme open "my-app://vehicles/vehicle-id" --android
npx uri-scheme open "my-app://vehicles/vehicle-id" --ios
```

No Android também é possível usar:

```bash
adb shell am start -W \
  -a android.intent.action.VIEW \
  -d "my-app://vehicles/vehicle-id" \
  com.example.myapp
```

Depois gere ou execute o build:

```bash
bun run android
bun run ios
```

Para distribuição, gere o APK/AAB com Gradle e o archive iOS com Xcode usando o fluxo nativo do projeto. O EAS continua sendo usado somente para vincular o projeto e armazenar as credenciais de push.

Valide a entrega em três estados:

- app aberto;
- app em segundo plano;
- app encerrado.

Valide também:

- permissão concedida e negada;
- usuário com opt-in desligado;
- login, troca de conta e logout;
- dispositivo com token atualizado;
- token inválido/desinstalação;
- usuário sem o papel permitido;
- troca de vínculo entre usuário e entidade;
- eventos duplicados e fora de ordem;
- toque abrindo exatamente a tela esperada.

Teste primeiro um token pelo Expo Push Notifications Tool. Quando a infraestrutura estiver confirmada, teste o evento real gerado pelo backend.

## 18. Diagnóstico rápido

### Android não recebe

- Confirme que o `package` é idêntico no app e no Firebase.
- Confirme `google-services.json` no build correto.
- Confirme que a chave da conta de serviço FCM V1 foi enviada ao projeto EAS correto.
- Confirme que o canal foi criado antes do registro.
- Confirme a permissão no Android 13+.
- Gere um novo build após alterar configuração nativa.

### iOS não recebe

- Confirme o `bundleIdentifier`.
- Confirme Push Notifications no App ID.
- Confirme `aps-environment` nos entitlements do build.
- Confirme a APNs Auth Key, Key ID e Team ID no projeto EAS.
- Recrie o provisioning profile/build após alterar capabilities.

### O token não é gerado

- Confirme `extra.eas.projectId`.
- Confirme conexão com a internet.
- Não teste somente no Expo Go.
- Confirme se o usuário concedeu permissão.

### O EAS informa que `eas.json` não existe ou está vazio

- Confirme que o comando está sendo executado na mesma pasta do `package.json` do app.
- Execute `bunx eas-cli@latest init` para vincular o projeto.
- Crie o `eas.json` mínimo mostrado neste tutorial.
- Confirme que existe `build.production` no arquivo.
- Valide com `bunx eas-cli@latest config --platform android --profile production --non-interactive`.

### A notificação chega, mas não abre a tela

- Confirme que `data.url` está presente.
- Confirme que o prefixo corresponde ao `scheme`.
- Confirme que o caminho existe em `linking.config`.
- Confirme se o navigator da rota já existe após a hidratação da autenticação.
- Teste a mesma URL diretamente com `uri-scheme`.

## 19. Checklist para novos projetos

### App

- [ ] Instalar `expo-notifications`, `expo-device` e `expo-constants`.
- [ ] Configurar o plugin `expo-notifications`.
- [ ] Configurar `scheme`.
- [ ] Configurar `android.package` e `ios.bundleIdentifier`.
- [ ] Vincular o EAS e confirmar `projectId`.
- [ ] Criar um `eas.json` mínimo com `build.production` para usar `eas credentials`.
- [ ] Criar canal Android antes de solicitar token.
- [ ] Solicitar permissão somente com contexto e opt-in.
- [ ] Registrar e atualizar o token no backend.
- [ ] Desabilitar a instalação no logout.
- [ ] Configurar `linking.getInitialURL` e `linking.subscribe`.
- [ ] Validar `data.url` antes de navegar.

### Firebase/Android

- [ ] Cadastrar o app com o package correto.
- [ ] Adicionar `google-services.json`.
- [ ] Gerar a chave privada da conta de serviço FCM V1.
- [ ] Enviar a chave ao EAS sem versioná-la.
- [ ] Ignorar `*-firebase-adminsdk-*.json`, sem excluir o `google-services.json` necessário ao build.

### Apple/iOS

- [ ] Habilitar Push Notifications no App ID.
- [ ] Confirmar `aps-environment`.
- [ ] Enviar a APNs Auth Key ao EAS.
- [ ] Gerar um novo provisioning profile/build.

### Backend

- [ ] Persistir vários dispositivos por usuário.
- [ ] Persistir preferências por categoria de notificação.
- [ ] Validar autorização e vínculo no momento do envio.
- [ ] Deduplicar transições de evento.
- [ ] Enviar mensagens em lotes.
- [ ] Persistir tickets e consultar receipts.
- [ ] Desabilitar tokens com `DeviceNotRegistered`.
- [ ] Não expor segredos nem tokens completos em logs.

### Validação

- [ ] Testar deep link isoladamente.
- [ ] Testar push isoladamente.
- [ ] Testar o evento completo pelo backend.
- [ ] Testar app aberto, em segundo plano e encerrado.
- [ ] Testar opt-in, opt-out, logout e troca de usuário.
- [ ] Testar Android e iOS em builds reais.

## 20. Quando considerar OneSignal

OneSignal pode ser mais simples para projetos novos que precisam de painel de envio, segmentação, campanhas, métricas e mensagens agendadas. Ele possui SDK para React Native e config plugin para Expo.

Ele não elimina os fundamentos da configuração:

- Android continua dependendo do Firebase/FCM.
- iOS continua dependendo de APNs e da chave `.p8`.
- O app continua precisando de um novo build nativo.
- React Navigation continua responsável por interpretar o destino do clique.
- O backend ainda deve controlar autorização e regras de negócio para notificações transacionais.

Use Expo Notifications quando as mensagens são principalmente transacionais e disparadas pelo próprio backend. Considere OneSignal quando a operação precisa de um painel para campanhas e segmentação. Evite trocar um projeto já implementado apenas para reduzir etapas iniciais: a migração de tokens, SDK e backend também tem custo.

## Referências oficiais

- [Expo Notifications — SDK 56](https://docs.expo.dev/versions/v56.0.0/sdk/notifications/)
- [Configuração de push notifications com Expo](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Credenciais Android FCM V1](https://docs.expo.dev/push-notifications/fcm-credentials/)
- [Envio pelo Expo Push Service](https://docs.expo.dev/push-notifications/sending-notifications/)
- [Credenciais de aplicativos no EAS](https://docs.expo.dev/app-signing/app-credentials/)
- [Configuração do `eas.json`](https://docs.expo.dev/build/eas-json/)
- [Serviços alternativos de push para Expo](https://docs.expo.dev/guides/using-push-notifications-services/)
- [Config plugin do OneSignal para Expo](https://github.com/OneSignal/onesignal-expo-plugin)
- [Deep linking com React Navigation](https://reactnavigation.org/docs/deep-linking/)
- [Configuração de links no React Navigation](https://reactnavigation.org/docs/configuring-links/)
