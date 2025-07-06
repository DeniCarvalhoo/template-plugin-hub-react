---
applyTo: "**"
---
# Padrões Gerais de Desenvolvimento do Projeto

## Idioma
- Todas as comunicações, mensagens, comentários, respostas automáticas e documentação devem ser feitas em **português do Brasil (pt-BR)**, salvo instrução em contrário.

## Convenções de Nomeação
- Use **PascalCase** para nomes de componentes, interfaces e aliases de tipo.
- Use **camelCase** para variáveis, funções e métodos.
- Prefixe membros privados de classes com **underscore (_)**.
- Use **TODAS_EM_MAIÚSCULAS** para constantes globais.

## Diretrizes Específicas
- ❌ **Não crie arquivos de documentação** (como `README.md`) **a menos que seja explicitamente solicitado**.
- ❌ **Não crie testes unitários** ou arquivos de teste **sem uma solicitação explícita**.
- ❌ **Não implemente arquivos ou mecanismos de seed** para preenchimento de dados **sem uma solicitação explícita**.
- ❌ **Não adicione exemplos de uso ou implementação** da funcionalidade **a menos que seja explicitamente requisitado**.

## Execução de Comandos CLI
- ✅ Se estiver em um projeto **JavaScript, TypeScript ou React (com `.js`, `.ts`, `.tsx`)**, utilize **`pnpm` em vez de `npm`** para execução de scripts e comandos CLI.
- ✅ Se existir arquivo `Makefile` e o container do projeto estiver rodando no docker, utilize **`make`** para executar comandos definidos no `Makefile`. Se não encontrar um comando adequado, sugira a criação de um novo comando no `Makefile` para a tarefa desejada.