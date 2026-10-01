#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const environments = [
  { label: "production — API de produção", value: "prod" },
  { label: "preview — API de demonstração", value: "demo" },
  { label: "development — API de desenvolvimento", value: "dev" },
];

const builds = [
  {
    label: "Android APK — instalação direta",
    script: "build:android:apk",
    output: "android/app/build/outputs/apk/release/",
  },
  {
    label: "Android AAB — Google Play",
    script: "build:android:aab",
    output: "android/app/build/outputs/bundle/release/app-release.aab",
  },
  {
    label: "iOS Archive — Xcode/App Store",
    script: "build:ios:archive",
    output: "ios/build/rntemplate.xcarchive",
  },
];

const versionKinds = [
  { label: "patch — correção compatível", value: "patch" },
  { label: "minor — nova funcionalidade compatível", value: "minor" },
  { label: "major — mudança incompatível", value: "major" },
  { label: "manter versão — incrementar apenas os builds", value: "build" },
];

const readline = createInterface({ input: stdin, output: stdout });

async function select(message, options) {
  while (true) {
    console.log(`\n${message}`);
    options.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option.label}`);
    });

    const answer = await readline.question("Escolha: ");
    const selected = options[Number(answer) - 1];

    if (selected) return selected;

    console.log("Opção inválida.");
  }
}

async function confirm(message) {
  const answer = await readline.question(`${message} [s/N]: `);
  return ["s", "sim", "y", "yes"].includes(answer.trim().toLowerCase());
}

try {
  console.log("Build local — rn-template");

  const environment = await select("Qual ambiente deseja usar?", environments);
  const build = await select("Qual artefato deseja gerar?", builds);
  const versionKind = await select(
    "Como deseja versionar este build?",
    versionKinds,
  );

  console.log(
    `\nAmbiente: ${environment.value}\nVersão: ${versionKind.value}\nComando: bun run ${build.script}\nSaída: ${build.output}\n`,
  );

  if (!(await confirm("Continuar?"))) {
    console.log("Build cancelado.");
    process.exitCode = 1;
  } else {
    readline.close();
    const versionResult = spawnSync(
      "node",
      ["scripts/version.mjs", versionKind.value],
      { stdio: "inherit" },
    );

    if (versionResult.status !== 0) {
      process.exitCode = versionResult.status ?? 1;
      process.exit();
    }

    const result = spawnSync("bun", ["run", build.script], {
      stdio: "inherit",
      env: {
        ...process.env,
        EXPO_PUBLIC_MODE: environment.value,
      },
    });

    process.exitCode = result.status ?? 1;
  }
} finally {
  readline.close();
}
