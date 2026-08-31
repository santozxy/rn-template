const ENABLE_LOGS = true; // Defina como false para desativar os logs

// Cores ANSI
const colors = {
  reset: "\x1b[0m",
  info: "\x1b[32m", // verde
  warn: "\x1b[33m", // amarelo
  error: "\x1b[31m", // vermelho
  ns: "\x1b[35m", // roxo
  key: "\x1b[36m", // ciano
  value: "\x1b[32m", // verde
};

function colorizeJson(json: any) {
  if (!json || typeof json !== "object") {
    return json;
  }
  const text = JSON.stringify(json, null, 2);

  return (
    text
      // "key":
      .replace(/"([^"]+)":/g, (_, key) => {
        return `${colors.key}"${key}"${colors.reset}:`;
      })
      // "value"
      .replace(/: "([^"]+)"/g, (_, value) => {
        return `: ${colors.value}"${value}"${colors.reset}`;
      })

      .replace(/: ([0-9.\-]+)/g, (_, value) => {
        return `: ${colors.value}${value}${colors.reset}`;
      })
  );
}

export const logger = {
  info: (title: string, data?: any) => {
    if (!ENABLE_LOGS) return;
    console.log(`${colors.info}[INFO] ♻️  ${title}${colors.reset}`);
    if (data !== undefined) console.log(data);
  },

  warn: (title: string, data?: any) => {
    if (!ENABLE_LOGS) return;
    console.log(`${colors.warn}[WARN] ⚠️ ${title}${colors.reset}`);
    if (data !== undefined) console.log(data);
  },

  error: (title: string, error?: any) => {
    if (!ENABLE_LOGS) return;
    console.log(`${colors.error}[ERROR] ❌ ${title}${colors.reset}`);
    if (error !== undefined) console.log(error);
  },

  ns: (namespace: string, title: string, data?: any) => {
    if (!ENABLE_LOGS) return;

    console.log(`${colors.ns}[${namespace}] ${title}${colors.reset}`);
    if (data !== undefined) {
      console.log(colorizeJson(data));
    }
  },

  json: (title: string, json: any) => {
    if (!ENABLE_LOGS) return;

    console.log(`${colors.key}[JSON] ${title}${colors.reset}`);
    console.log(colorizeJson(json));
  },
};
