# Configurar Feed do Instagram

O site ja esta pronto para exibir o feed automatico na secao `Instagram`.

## 1) Criar token no Meta
1. Garanta que a conta da igreja seja `Business` ou `Creator`.
2. No Meta for Developers, configure o acesso da Instagram Graph API.
3. Gere um token com permissao para leitura de midia.
4. Converta para token de longa duracao.

## 2) Configurar variavel de ambiente
Defina no servidor/deploy:

`INSTAGRAM_ACCESS_TOKEN=seu_token_longo_aqui`

## 3) Endpoint usado pelo site
O front-end chama:

`/api/instagram-feed?limit=6`

Arquivo do endpoint:

`api/instagram-feed.js`

## 4) Validar
Depois do deploy:
1. Acesse `/api/instagram-feed?limit=2` e confirme retorno JSON.
2. Recarregue a home e verifique se as publicacoes aparecem na secao `Instagram`.

## Observacao
Sem `INSTAGRAM_ACCESS_TOKEN`, o site mostra fallback com link para o Instagram da igreja.
