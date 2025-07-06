import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginsRoot = path.resolve(__dirname, "src", "plugins");

const distRoot = path.resolve(__dirname, "dist");

// 🔹 Carrega info do package.json
const pkg = JSON.parse(
  await fs.readFile(path.resolve(__dirname, "package.json"), "utf-8"),
);

// 🧹 limpa dist/ inteiro antes de tudo
await fs.rm(distRoot, { recursive: true, force: true });
await fs.mkdir(distRoot, { recursive: true });

const plugins = await fs.readdir(pluginsRoot);
const pluginEntries: any[] = [];

for (const pluginDir of plugins) {
  const stat = await fs.stat(path.resolve(pluginsRoot, pluginDir));
  if (!stat.isDirectory()) continue;
  const pluginPath = path.resolve(pluginsRoot, pluginDir);

  const entryPath = path.resolve(pluginPath, "index.tsx");
  const metaPath = path.resolve(pluginPath, "meta.ts");

  // 🔁 Importa dinamicamente o meta.ts para pegar a versão
  const metaModule = await import(`file://${metaPath}`);
  const meta = metaModule.meta;
  const version = meta.version;
  const id = meta.id;

  const outDir = path.resolve(distRoot, pluginDir);
  console.log(`🔨 Iniciando build do plugin '${pluginDir}'`);
  // 👉 Define as variáveis de ambiente esperadas no vite.config.plugin.ts
  process.env.ENTRY = entryPath;
  process.env.PLUGIN_NAME = pluginDir;

  await build({
    configFile: path.resolve(__dirname, "vite.config.plugin.ts"),
    build: {
      lib: {
        entry: entryPath,
        formats: ["iife"],
        name: id.replace(/[-\s]/g, "_"),
        fileName: () => `index-${version}.js`,
      },
      outDir,
      emptyOutDir: true, // limpa só a subpasta antes de cada plugin
    },
  });

  // 🔍 Verifica se há screenshots e copia para o build, se existirem
  const screenshotsDir = path.resolve(pluginPath, "screenshots");
  let screenshots: string[] = [];

  try {
    const files = await fs.readdir(screenshotsDir);
    const imageFiles = files.filter((f) =>
      [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(
        path.extname(f).toLowerCase(),
      ),
    );
    screenshots = imageFiles.map((f) => `/${pluginDir}/screenshots/${f}`);

    if (imageFiles.length > 0) {
      const destScreenshotsDir = path.resolve(outDir, "screenshots");
      await fs.mkdir(destScreenshotsDir, { recursive: true });
      for (const file of imageFiles) {
        await fs.copyFile(
          path.resolve(screenshotsDir, file),
          path.resolve(destScreenshotsDir, file),
        );
      }
    }
  } catch {
    // Pasta não existe ou não é acessível
    screenshots = [];
  }

  pluginEntries.push({
    id: `${pkg.name}_${meta.id}`,
    displayName: meta.displayName,
    name: meta.name,
    version: meta.version,
    url: `/${pluginDir}/index-${version}.js`,
    description: meta.description,
    tags: meta.tags ?? [],
    screenshots,
  });
  console.log(
    `✅ Plugin '${pluginDir}' buildado com sucesso em /dist/${pluginDir}`,
  );
}

// 📝 Gera o manifest.json
const manifest = {
  name: pkg.name,
  displayName: pkg.displayName ?? pkg.name,
  description: pkg.description ?? pkg.displayName ?? pkg.name,
  plugins: pluginEntries,
};

await fs.writeFile(
  path.join(distRoot, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`📦 Manifesto gerado com sucesso em dist/manifest.json`);
