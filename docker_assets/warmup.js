const fs = require("node:fs");
const https = require("https");
const http = require("http");

const MANIFEST_PATH = "/app/dist/manifest.json";
const BASE_API_HUB = process.env.BASE_API_HUB;
const SERVER_HOST =
  process.env.SERVER_HOST || "https://template-plugin-hub-react.onrender.com";
const PORT = process.env.PORT || 5001;

if (!BASE_API_HUB) {
  console.error("❌ Erro: BASE_API_HUB não está definido");
  process.exit(1);
}

// Lê o manifest.json
let manifest;
try {
  const manifestContent = fs.readFileSync(MANIFEST_PATH, "utf8");
  manifest = JSON.parse(manifestContent);
} catch (error) {
  console.error("❌ Erro ao ler manifest.json:", error.message);
  process.exit(1);
}

// Monta a URL do manifest baseada no host do servidor
const manifestUrl = `${SERVER_HOST}/manifest.json`;

// Monta o body da requisição baseado no manifest.json
const body = {
  manifestUrl: manifestUrl,
  projectName: manifest.name || "",
  projectDisplayName: manifest.displayName || "",
  projectDescription: manifest.description || "",
  plugins: manifest.plugins || [],
};

console.log("📋 Dados extraídos do manifest:");
console.log(`   - URL do manifest: ${manifestUrl}`);
console.log(`   - Nome do projeto: ${body.projectName}`);
console.log(`   - Nome de exibição: ${body.projectDisplayName}`);
console.log(`   - Descrição: ${body.projectDescription}`);
console.log(`   - Número de plugins: ${body.plugins.length}`);

const bodyString = JSON.stringify(body);
const url = new URL(`${BASE_API_HUB}/public/plugins/manifest-release`);

const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === "https:" ? 443 : 80),
  path: url.pathname,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(bodyString),
  },
};

console.log(
  `📤 Enviando requisição para: ${BASE_API_HUB}/public/plugins/manifest-release`,
);

const client = url.protocol === "https:" ? https : http;

const req = client.request(options, (res) => {
  let responseBody = "";

  res.on("data", (chunk) => {
    responseBody += chunk;
  });

  res.on("end", () => {
    console.log(`📋 Status HTTP: ${res.statusCode}`);
    console.log(`📋 Resposta: ${responseBody}`);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log("✅ Manifest enviado com sucesso para a API!");
    } else {
      console.log(
        `⚠️  Aviso: Falha ao enviar manifest (HTTP ${res.statusCode}). Aplicação continuará rodando.`,
      );
    }
  });
});

req.on("error", (error) => {
  console.log(
    "⚠️  Aviso: Erro na requisição:",
    error.message,
    ". Aplicação continuará rodando.",
  );
});

req.write(bodyString);
req.end();
