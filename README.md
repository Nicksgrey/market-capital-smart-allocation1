# Smart Wealth Engine

Estamos iniciando um novo software da Market Capital chamado Motor Inteligente de Alocação Patrimonial.

Antes de criar qualquer componente, conecte este projeto ao projeto Supabase existente da Market Capital. Toda a persistência de dados, autenticação e futuras tabelas devem utilizar exclusivamente esse banco. Não criar um novo projeto Supabase.

Project URL: https://wfafvpsixaotzegvvwkx.supabase.co

Project Ref: wfafvpsixaotzegvvwkx

Toda autenticação, banco de dados, tabelas, storage, funções e futuras migrações devem utilizar este projeto existente do Supabase.

Antes de qualquer implementação:

1. Conecte este projeto ao projeto Supabase já existente.

2. Não crie um novo banco.

3. Não altere nenhuma tabela existente sem solicitação.

4. Utilize toda a autenticação existente do Supabase.

5. Todas as novas tabelas deverão ser criadas neste mesmo projeto do Supabase.

6. Crie apenas a estrutura inicial do projeto, sem implementar regras de negócio.

7. Organize a aplicação para suportar uma arquitetura em camadas, conforme a documentação que será fornecida posteriormente.

Nunca altere ou exclua tabelas, colunas, políticas RLS, funções ou migrations existentes no Supabase sem autorização explícita. Toda nova funcionalidade deve utilizar novas tabelas ou extensões compatíveis com a estrutura atual, preservando integralmente os projetos já em produção.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://market-capital-smart-allocation.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/15af5bd9-117f-42f7-940a-48ad14237f9f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
