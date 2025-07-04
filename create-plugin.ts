#!/usr/bin/env tsx

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as readline from "readline";

interface PluginConfig {
  folderName: string;
  displayName: string;
  description: string;
  tags: string[];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function validateFolderName(name: string): boolean {
  // Aceita padrões: nome-pasta, nome_pasta, nomePasta (sem acentos)
  const pattern = /^[a-zA-Z][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z]$/;
  return pattern.test(name) && !/[àáâãäèéêëìíîïòóôõöùúûüçñ]/i.test(name);
}

function convertToKebabCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab-case
    .replace(/_/g, "-") // snake_case to kebab-case
    .toLowerCase();
}

function convertToPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

async function askQuestion(
  prompt: string,
  validator?: (value: string) => boolean,
  errorMessage?: string,
): Promise<string> {
  while (true) {
    const answer = await question(prompt);

    if (!answer.trim()) {
      console.log("❌ Este campo é obrigatório. Tente novamente.");
      continue;
    }

    if (validator && !validator(answer)) {
      console.log(`❌ ${errorMessage || "Valor inválido"}. Tente novamente.`);
      continue;
    }

    return answer.trim();
  }
}

function createComponentFile(pluginPath: string, componentName: string): void {
  const componentContent = `export default function ${componentName}() {
  return (
    <div className="hub:p-4">
      ${componentName} Component
    </div>
  );
}
`;

  writeFileSync(join(pluginPath, "component.tsx"), componentContent);
}

function createMetaFile(pluginPath: string, config: PluginConfig): void {
  const metaContent = `import type { IPluginMeta } from "@/types";

export const meta: IPluginMeta = {
  id: "${config.folderName}",
  displayName: "${config.displayName}",
  description: "${config.description}",
  version: "1.0.0",
  tags: [${config.tags.map((tag) => `"${tag.trim()}"`).join(", ")}],
};
`;

  writeFileSync(join(pluginPath, "meta.ts"), metaContent);
}

function createIndexFile(pluginPath: string): void {
  const indexContent = `import pkg from "../../../package.json";
import Component from "./component";
import { meta } from "./meta";
import styles from "./style.css?inline"; // Gerado automaticamente no build

(window as any)[\`Plugin_\${pkg.name}_\${meta.id}\`] = {
  ...meta,
  Component,
  styles,
};
`;

  writeFileSync(join(pluginPath, "index.tsx"), indexContent);
}

function createStyleFile(pluginPath: string): void {
  const styleContent = `/* Não alterar essas duas linhas */
@import "@vert-capital/hub-plugin-style/style";
@source "./";

/* Daqui para baixo inclua apenas os caminhis relativos que realmente são necessários para este plugin */
/* Exemplo: @source "../../components/ui/button.tsx"; */
`;

  writeFileSync(join(pluginPath, "style.css"), styleContent);
}

function updatePluginsIndex(folderName: string, componentName: string): void {
  const indexPath = join(process.cwd(), "src", "plugins", "index.ts");

  try {
    const currentContent = readFileSync(indexPath, "utf-8");

    // Adiciona o novo import no final dos imports existentes
    const importLine = `import ${componentName} from "./${folderName}/component";`;

    // Procura por linhas de import existentes
    const importLines = currentContent
      .split("\n")
      .filter((line) => line.trim().startsWith("import"));
    const nonImportLines = currentContent
      .split("\n")
      .filter(
        (line) => !line.trim().startsWith("import") || line.trim() === "",
      );

    // Encontra a linha de export
    const exportLineIndex = nonImportLines.findIndex((line) =>
      line.trim().startsWith("export"),
    );

    if (exportLineIndex !== -1) {
      const exportLine = nonImportLines[exportLineIndex];
      const exportMatch = exportLine.match(/export\s*{\s*([^}]*)\s*}/);

      if (exportMatch) {
        const currentExports = exportMatch[1].trim();
        const newExports = currentExports
          ? `${currentExports}, ${componentName}`
          : componentName;
        const newExportLine = `export { ${newExports} };`;

        // Reconstrói o arquivo
        const allImports = [...importLines, importLine];
        const updatedNonImportLines = [...nonImportLines];
        updatedNonImportLines[exportLineIndex] = newExportLine;

        const newContent = [
          ...allImports,
          "",
          ...updatedNonImportLines.filter((line) => line.trim() !== ""),
        ].join("\n");

        writeFileSync(indexPath, newContent);
      }
    } else {
      // Se não encontrar export, adiciona no final
      const allImports = [...importLines, importLine];
      const newContent = [
        ...allImports,
        "",
        `export { ${componentName} };`,
      ].join("\n");
      writeFileSync(indexPath, newContent);
    }

    console.log("✅ Arquivo src/plugins/index.ts atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar src/plugins/index.ts:", error);
    throw error;
  }
}

function updatePreviewIndex(folderName: string, componentName: string): void {
  const previewPath = join(process.cwd(), "src", "preview", "index.tsx");

  try {
    const currentContent = readFileSync(previewPath, "utf-8");

    // Adiciona o novo import de componente
    const componentImportRegex =
      /import\s*{\s*([^}]*)\s*}\s*from\s*"@\/plugins";/;
    const componentImportMatch = currentContent.match(componentImportRegex);

    if (componentImportMatch) {
      const currentComponents = componentImportMatch[1].trim();
      const newComponents = currentComponents
        ? `${currentComponents}, ${componentName}`
        : componentName;
      const newComponentImport = `import { ${newComponents} } from "@/plugins";`;

      let updatedContent = currentContent.replace(
        componentImportRegex,
        newComponentImport,
      );

      // Adiciona o import do meta
      const metaImportLine = `import { meta as ${folderName.replace(/-/g, "")}Meta } from "@/plugins/${folderName}/meta";`;
      const lastMetaImportMatch = updatedContent.match(
        /import\s*{\s*meta\s+as\s+\w+Meta\s*}\s*from\s*"@\/plugins\/[^"]+\/meta";/g,
      );

      if (lastMetaImportMatch) {
        const lastMetaImport =
          lastMetaImportMatch[lastMetaImportMatch.length - 1];
        const lastMetaImportIndex = updatedContent.lastIndexOf(lastMetaImport);
        const insertIndex = lastMetaImportIndex + lastMetaImport.length;
        updatedContent =
          updatedContent.slice(0, insertIndex) +
          `\n${metaImportLine}` +
          updatedContent.slice(insertIndex);
      } else {
        // Se não encontrar imports de meta, adiciona após o import de plugins
        const pluginsImportIndex = updatedContent.indexOf(newComponentImport);
        const insertIndex = pluginsImportIndex + newComponentImport.length;
        updatedContent =
          updatedContent.slice(0, insertIndex) +
          `\n${metaImportLine}` +
          updatedContent.slice(insertIndex);
      }

      // Adiciona o plugin no array de plugins
      const pluginsArrayRegex = /const\s+plugins\s*=\s*\[([^\]]*)\];/s;
      const pluginsArrayMatch = updatedContent.match(pluginsArrayRegex);

      if (pluginsArrayMatch) {
        const currentPlugins = pluginsArrayMatch[1].trim();
        const newPluginEntry = `{ Component: ${componentName}, meta: ${folderName.replace(/-/g, "")}Meta }`;

        // Remove vírgulas desnecessárias e adiciona o novo plugin
        const cleanedPlugins = currentPlugins
          .replace(/,\s*,/g, ",")
          .replace(/,\s*$/, "");
        const newPlugins = cleanedPlugins
          ? `${cleanedPlugins},\n  ${newPluginEntry}`
          : `\n  ${newPluginEntry}`;

        const newPluginsArray = `const plugins = [${newPlugins}\n];`;

        updatedContent = updatedContent.replace(
          pluginsArrayRegex,
          newPluginsArray,
        );
      }

      writeFileSync(previewPath, updatedContent);
      console.log("✅ Arquivo src/preview/index.tsx atualizado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar src/preview/index.tsx:", error);
    // Não interrompe o processo se der erro no preview
    console.log(
      "⚠️  O plugin foi criado, mas você precisará adicionar manualmente ao preview",
    );
  }
}

async function main(): Promise<void> {
  console.log("🚀 Criador de Plugin - Template Plugin Hub React\n");

  try {
    // Pergunta 1: Nome da pasta
    const folderName = await askQuestion(
      "📁 Nome da pasta (formato: nome-pasta, nome_pasta ou nomePasta): ",
      validateFolderName,
      "Nome deve seguir o padrão nome-pasta, nome_pasta ou nomePasta, sem acentos",
    );

    const kebabCaseName = convertToKebabCase(folderName);
    const componentName = convertToPascalCase(folderName);

    // Verifica se a pasta já existe
    const pluginPath = join(process.cwd(), "src", "plugins", kebabCaseName);
    if (existsSync(pluginPath)) {
      console.log(
        `❌ A pasta "${kebabCaseName}" já existe. Escolha outro nome.`,
      );
      process.exit(1);
    }

    // Pergunta 2: Nome de exibição
    const displayName = await askQuestion("✨ Nome de exibição: ");

    // Pergunta 3: Descrição
    const description = await askQuestion("📝 Descrição: ");

    // Pergunta 4: Tags
    const tagsInput = await askQuestion(
      "🏷️  Tags (separe por vírgula, exemplo: tabela, emissões): ",
    );
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    if (tags.length === 0) {
      console.log("❌ Pelo menos uma tag é obrigatória.");
      process.exit(1);
    }

    const config: PluginConfig = {
      folderName: kebabCaseName,
      displayName,
      description,
      tags,
    };

    console.log("\n📋 Resumo do plugin:");
    console.log(`   Pasta: ${config.folderName}`);
    console.log(`   Nome: ${config.displayName}`);
    console.log(`   Descrição: ${config.description}`);
    console.log(`   Tags: ${config.tags.join(", ")}`);
    console.log(`   Componente: ${componentName}`);

    const confirm = await question(
      "\n✅ Confirma a criação do plugin? (s/n): ",
    );

    if (confirm.toLowerCase() !== "s" && confirm.toLowerCase() !== "sim") {
      console.log("❌ Criação cancelada.");
      process.exit(0);
    }

    // Cria a estrutura do plugin
    console.log("\n🔨 Criando estrutura do plugin...");

    // Cria a pasta do plugin
    mkdirSync(pluginPath, { recursive: true });
    console.log(`✅ Pasta criada: ${pluginPath}`);

    // Cria os arquivos
    createComponentFile(pluginPath, componentName);
    console.log("✅ component.tsx criado");

    createMetaFile(pluginPath, config);
    console.log("✅ meta.ts criado");

    createIndexFile(pluginPath);
    console.log("✅ index.tsx criado");

    createStyleFile(pluginPath);
    console.log("✅ style.css criado");

    // Atualiza o index.ts dos plugins
    updatePluginsIndex(config.folderName, componentName);

    // Atualiza o preview/index.tsx
    updatePreviewIndex(config.folderName, componentName);

    console.log("\n🎉 Plugin criado com sucesso!");
    console.log(`📂 Localização: src/plugins/${config.folderName}`);
    console.log("\n🛠️  Próximos passos:");
    console.log(
      "1. Edite o arquivo component.tsx para implementar sua funcionalidade",
    );
    console.log(
      "2. Adicione estilos personalizados no style.css se necessário",
    );
    console.log('3. Execute "pnpm run build" para compilar o plugin');
  } catch (error) {
    console.error("\n❌ Erro durante a criação do plugin:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Executa o script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
