const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

const restrictedTextImport = {
  name: "react-native",
  importNames: ["Text"],
  message:
    "Use @/components/ui/text para manter tipografia e tema padronizados.",
};

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  { ignores: ["dist/*", "ios/*", "android/*"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/hooks/use-action.ts", "src/components/ui/text.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              importNames: ["useMutation"],
              message:
                "Use useAction para manter tratamento de erros e bloqueio offline.",
            },
            restrictedTextImport,
          ],
        },
      ],
    },
  },
  {
    files: ["src/hooks/use-action.ts"],
    rules: {
      "no-restricted-imports": ["error", { paths: [restrictedTextImport] }],
    },
  },
  {
    files: [
      "src/components/form/global-form/global-form.tsx",
      "src/components/list/list-paginated.tsx",
      "src/components/ui/color-picker.tsx",
      "src/components/ui/dialog.tsx",
      "src/components/ui/menu.tsx",
      "src/components/ui/progress.tsx",
      "src/components/ui/skeleton.tsx",
      "src/hooks/use-biometric.ts",
      "src/hooks/use-push-notifications.ts",
    ],
    rules: {
      "react-hooks/incompatible-library": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
