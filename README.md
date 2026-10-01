# RN Template

Template Expo SDK 56 baseado na infraestrutura do `react-native-template`, com a arquitetura de navegação React Navigation utilizada no `meu-e-gov-app`.

## Recursos incluídos

- Login em `POST /api/auth/login`, sessão persistida e Bearer token no Axios.
- Fluxos autenticado e público separados por `AppStack` e `AuthStack`.
- Bottom tabs para Início, Usuários e Configurações.
- Telas de criação, detalhes e edição fora das tabs.
- CRUD de usuários integrado ao `nest-template`.
- `useAction`, `usePaginatedList` e `ListPaginated`.
- TanStack Query com cache persistente e estados offline.
- Tema claro/escuro, toasts, formulários, máscaras e componentes responsivos.
- Animação Lottie de inicialização enquanto fontes e cache offline são preparados.
- Providers de autenticação, rede, upload, safe area, gestos, teclado e bottom sheets.
- Deep links e suporte opcional à abertura de rotas por notificações.

## Executando com o nest-template

No backend:

```bash
cd ../../backend/nest-template
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed
pnpm dev
```

No aplicativo:

```bash
cp .env.example .env
bun install
bun run ios
# ou
bun run android
```

A API usa `http://localhost:3333/api` por padrão. O usuário administrador do seed é:

- E-mail: `admin@syslae.com`
- Senha: `password`

Defina `EXPO_PUBLIC_MODE` como `dev`, `demo` ou `prod`. O `getUrlConfig` seleciona respectivamente `EXPO_PUBLIC_API_DEV_BASE_URL`, `EXPO_PUBLIC_API_DEMO_BASE_URL` ou `EXPO_PUBLIC_API_PROD_BASE_URL`.

Push notifications ficam desativadas por padrão para que o template compile com um provisioning profile comum. Para ativá-las no iOS, configure um App ID explícito com a capability **Push Notifications** no Apple Developer, adicione novamente o plugin `expo-notifications` ao `app.json` e defina `EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true`. O prebuild criará o entitlement `aps-environment`; não o adicione manualmente antes de o profile aceitar a capability.

Use `http://localhost:3333/api` no iOS Simulator, `http://10.0.2.2:3333/api` no Android Emulator ou o IP da máquina em um dispositivo físico.

## Navegação

```text
NavigationContainer
├── AuthStack
│   └── Login
└── AppStack
    ├── AppTabs
    │   ├── Home
    │   ├── Users
    │   └── Settings
    ├── UserCreate
    ├── UserDetails
    └── UserUpdate
```

`AppTabs` é apenas a primeira tela do `AppStack`. Portanto, criação, detalhes e edição de usuários não exibem a barra inferior.

Os headers nativos permanecem desativados. As telas usam o mesmo padrão do meu-e-gov:

- `header={<MainHeader />}` nas telas principais.
- `title` em `Screen`, `ScrollableScreen` ou `FormScreen` para o header padrão.
- Um componente em `header` para substituir o header quando necessário.

## Organização

```text
src/
  routes/
    index.tsx
    auth-stack.tsx
    app-stack.tsx
    tab-stack.tsx
    linking.ts
    types.ts
  screens/
    auth/login/
    app/home/
    app/settings/
    app/users/{list,create,details,update}/
  components/
  domains/
  hooks/
  lib/
  providers/
  storage/
  theme/
  utils/
```

Arquivos que não representam entradas de tela seguem `kebab-case`. Os formulários de criação e atualização possuem seus próprios `fields` e tipos para poderem evoluir independentemente.

## Comandos

```bash
bun run start
bun run start:clear
bun run android
bun run ios
bun run web

bun run typecheck
bun run lint
bun run lint:fix
bun run format
bun run format:check
bun run dependencies:check
bun run doctor
bun run check
```

O projeto possui módulos nativos e deve ser executado em development build. O Expo Go não contém todas as dependências necessárias.

## Builds locais

O projeto gera os artefatos diretamente com Gradle e Xcode, sem EAS. Use o wizard para escolher o ambiente da API e o tipo de artefato:

```bash
bun run build
```

Também há comandos nativos diretos:

```bash
bun run build:android:apk
bun run build:android:aab
bun run build:ios:archive
```

O wizard também solicita o tipo de versionamento. Para atualizar versões sem iniciar um build, use:

```bash
bun run version:patch
bun run version:minor
bun run version:major
bun run version:build
```

`major`, `minor` e `patch` seguem versionamento semântico. `version:build` mantém a versão pública e incrementa apenas `versionCode` no Android e `CURRENT_PROJECT_VERSION` no iOS. Os comandos mantêm sincronizados `package.json`, `app.json`, `android/app/build.gradle` e o projeto Xcode.

- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- Archive iOS: `ios/build/rntemplate.xcarchive`

O wizard define `EXPO_PUBLIC_MODE` como `dev`, `demo` ou `prod`. As URLs continuam vindo do `.env`. O build iOS usa a assinatura configurada no projeto Xcode; a exportação do `.ipa` deve ser feita pelo Organizer ou com um `ExportOptions.plist` específico da conta.

# rn-template
