#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const kind = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
const validKinds = new Set(["major", "minor", "patch", "build"]);

if (!validKinds.has(kind)) {
  console.error("Uso: node scripts/version.mjs <major|minor|patch|build>");
  process.exit(1);
}

const paths = {
  package: path.join(root, "package.json"),
  app: path.join(root, "app.json"),
  android: path.join(root, "android/app/build.gradle"),
  ios: path.join(root, "ios/rntemplate.xcodeproj/project.pbxproj"),
};

const packageJson = JSON.parse(readFileSync(paths.package, "utf8"));
const appJson = JSON.parse(readFileSync(paths.app, "utf8"));
const androidBuild = readFileSync(paths.android, "utf8");
const iosProject = readFileSync(paths.ios, "utf8");

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

  if (!match) {
    throw new Error(`Versão semântica inválida: ${version}`);
  }

  return match.slice(1).map(Number);
}

function normalizeAppleVersion(version) {
  const parts = version.split(".");

  if (parts.length > 3 || parts.some((part) => !/^\d+$/.test(part))) {
    throw new Error(`MARKETING_VERSION inválida: ${version}`);
  }

  return [...parts, "0", "0"].slice(0, 3).join(".");
}

function uniqueMatches(content, pattern, label) {
  const values = [...content.matchAll(pattern)].map((match) => match[1]);
  const uniqueValues = [...new Set(values)];

  if (values.length === 0) {
    throw new Error(`${label} não encontrado`);
  }

  if (uniqueValues.length !== 1) {
    throw new Error(`${label} possui valores divergentes: ${uniqueValues}`);
  }

  return uniqueValues[0];
}

const currentVersion = packageJson.version;
const appVersion = appJson.expo?.version;
const androidVersion = uniqueMatches(
  androidBuild,
  /versionName\s+"([^"]+)"/g,
  "versionName do Android",
);
const iosVersion = uniqueMatches(
  iosProject,
  /MARKETING_VERSION = ([^;]+);/g,
  "MARKETING_VERSION do iOS",
);

parseVersion(currentVersion);

if (
  appVersion !== currentVersion ||
  androidVersion !== currentVersion ||
  normalizeAppleVersion(iosVersion) !== currentVersion
) {
  throw new Error(
    `Versões divergentes: package=${currentVersion}, app=${appVersion}, android=${androidVersion}, ios=${iosVersion}`,
  );
}

const [major, minor, patch] = parseVersion(currentVersion);
const nextVersion =
  kind === "major"
    ? `${major + 1}.0.0`
    : kind === "minor"
      ? `${major}.${minor + 1}.0`
      : kind === "patch"
        ? `${major}.${minor}.${patch + 1}`
        : currentVersion;

const androidVersionCode = Number(
  uniqueMatches(androidBuild, /versionCode\s+(\d+)/g, "versionCode do Android"),
);
const iosBuildNumber = Number(
  uniqueMatches(
    iosProject,
    /CURRENT_PROJECT_VERSION = (\d+);/g,
    "CURRENT_PROJECT_VERSION do iOS",
  ),
);
const nextAndroidVersionCode = androidVersionCode + 1;
const nextIosBuildNumber = iosBuildNumber + 1;

packageJson.version = nextVersion;
appJson.expo.version = nextVersion;

const nextAndroidBuild = androidBuild
  .replace(/versionCode\s+\d+/, `versionCode ${nextAndroidVersionCode}`)
  .replace(/versionName\s+"[^"]+"/, `versionName "${nextVersion}"`);
const nextIosProject = iosProject
  .replace(
    /CURRENT_PROJECT_VERSION = \d+;/g,
    `CURRENT_PROJECT_VERSION = ${nextIosBuildNumber};`,
  )
  .replace(
    /MARKETING_VERSION = [^;]+;/g,
    `MARKETING_VERSION = ${nextVersion};`,
  );

console.log(
  [
    `${dryRun ? "Simulação" : "Versão atualizada"}: ${currentVersion} → ${nextVersion}`,
    `Android versionCode: ${androidVersionCode} → ${nextAndroidVersionCode}`,
    `iOS build number: ${iosBuildNumber} → ${nextIosBuildNumber}`,
  ].join("\n"),
);

if (!dryRun) {
  writeFileSync(paths.package, `${JSON.stringify(packageJson, null, 2)}\n`);
  writeFileSync(paths.app, `${JSON.stringify(appJson, null, 2)}\n`);
  writeFileSync(paths.android, nextAndroidBuild);
  writeFileSync(paths.ios, nextIosProject);
}
