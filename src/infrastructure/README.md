# Infrastructure (Camada de Infraestrutura)

Implementações concretas: acesso ao Supabase (projeto existente da Market
Capital, ref `wfafvpsixaotzegvvwkx`), storage, integrações externas.

- `supabase/` — clientes e repositórios (após conectar a integração Supabase)
- `repositories/` — implementações das interfaces de `src/domain/repositories`

Regras: nada aqui é importado por `src/domain`. Segredos e chaves de serviço
só em código de servidor (`*.server.ts` / `createServerFn`).