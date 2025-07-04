# Plugin Hub React Template

Template para desenvolvimento de plugins React com TypeScript para o sistema OPS. Este projeto oferece uma estrutura organizada para criar, desenvolver e distribuir plugins de forma padronizada.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado) ou npm
- Docker (opcional, para desenvolvimento containerizado)

### Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd template-plugin-hub-react

# Instale as dependências
pnpm install

# Configure o ambiente (copia .env.sample para .env)
make init

# Inicie o servidor de desenvolvimento
pnpm dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── app/           # Componentes específicos da aplicação
│   └── ui/            # Componentes de interface reutilizáveis (shadcn/ui)
├── lib/
│   └── utils.ts       # Utilitários e helpers
├── plugins/           # 📦 Seus plugins ficam aqui
│   ├── index.ts       # Exportações dos plugins
│   ├── emissions-table/
│   └── refreshButton/
│       ├── component.tsx    # Componente principal do plugin
│       ├── index.tsx        # Exportação e configuração
│       ├── meta.ts          # Metadados do plugin
│       ├── style.css        # Estilos específicos (opcional)
│       └── screenshots/     # Capturas de tela (opcional)
├── preview/           # Área de preview/teste dos plugins
└── types.ts           # Definições de tipos TypeScript
```

## 🔧 Desenvolvendo Plugins

### Criando um Novo Plugin

Use o script automatizado para criar a estrutura básica:

```bash
pnpm create-plugin
```

Este comando criará:
- Pasta do plugin em `src/plugins/`
- Arquivos base (component.tsx, meta.ts, index.tsx)
- Registrará automaticamente no `src/plugins/index.ts`

### Estrutura de um Plugin

Cada plugin deve conter:

#### 1. `meta.ts` - Metadados
```typescript
import type { IPluginMeta } from "@/types";

export const meta: IPluginMeta = {
  id: "meu-plugin",
  displayName: "Meu Plugin",
  description: "Descrição do que o plugin faz",
  version: "1.0.0",
  tags: ["categoria", "funcionalidade"]
};
```

#### 2. `component.tsx` - Componente Principal
```typescript
import React from 'react';

const MeuPlugin: React.FC = () => {
  return (
    <div>
      {/* Sua implementação aqui */}
    </div>
  );
};

export default MeuPlugin;
```

#### 3. `index.tsx` - Exportação
```typescript
export { default } from './component';
export { meta } from './meta';
```

## 🛠 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento |
| `pnpm build` | Constrói todos os plugins para produção |
| `pnpm start` | Serve a versão construída (porta 5001) |
| `pnpm lint` | Executa linting com Biome |
| `pnpm create-plugin` | Cria um novo plugin interativamente |

## 🐳 Docker

### Desenvolvimento
```bash
# Subir ambiente de desenvolvimento
make up

# Rebuild completo
make rebuild

# Logs
make logs
```

### Produção
```bash
# Build da imagem de produção
docker build -t meus-plugins .

# Executar
docker run -p 5001:5001 meus-plugins
```

## 🎨 Estilização

O projeto utiliza:
- **Tailwind CSS** para estilização utilitária
- **shadcn/ui** para componentes base
- **CSS Modules** suportado para estilos específicos dos plugins

### Adicionando Componentes UI

```bash
# Adicionar novo componente shadcn/ui
npx shadcn@latest add button
npx shadcn@latest add input
```

## 📦 Build e Distribuição

### Build Individual
Cada plugin é construído separadamente com Vite:

```bash
pnpm build
```

### Estrutura do Build
```
dist/
├── emissions-table/
│   ├── index.js
│   ├── index.css
│   └── meta.json
└── refresh-button/
    ├── index.js
    ├── index.css
    └── meta.json
```

## 🔍 Debugging e Desenvolvimento

### Preview Local
O diretório `src/preview/` permite testar seus plugins localmente:

```typescript
// src/preview/index.tsx
import { MeuPlugin } from '@/plugins';

function Preview() {
  return (
    <div>
      <h1>Preview do Plugin</h1>
      <MeuPlugin />
    </div>
  );
}
```

### Variáveis de Ambiente
Configure no arquivo `.env`:

```env
# Exemplo de configurações
API_BASE_URL=https://api.exemplo.com
PLUGIN_DEBUG=true
```

## 📋 Boas Práticas

### Nomenclatura
- **Pastas**: kebab-case (`meu-plugin`)
- **Componentes**: PascalCase (`MeuPlugin`)
- **Arquivos**: kebab-case (`meu-arquivo.tsx`)

### Estrutura de Código
- Mantenha componentes pequenos e focados
- Use TypeScript para tipagem forte
- Implemente tratamento de erro
- Documente props e interfaces

### Performance
- Use `React.memo()` para componentes que não precisam re-renderizar
- Implemente lazy loading quando apropriado
- Otimize importações

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Para dúvidas e suporte:
- Abra uma issue no repositório
- Consulte a documentação do sistema OPS
- Entre em contato com a Denisson Carvalho

---

**Tecnologias utilizadas:**
- React 19 + TypeScript
- Vite para build e desenvolvimento
- Tailwind CSS + shadcn/ui
- Biome para linting
- Docker para containerização
