# Biblioteca MG COACH — como adicionar um novo material

## O fluxo agora é simples (2 arquivos)

A lista de estudos vive num único arquivo: **`estudos.json`**.
O `index.html` lê esse arquivo e monta os cards sozinho. **Você nunca mais mexe no `index.html`.**

A cada estudo novo, o Claude te entrega:
1. O **HTML do estudo** → você sobe na pasta `estudos/`
2. O **`estudos.json` já atualizado** → você substitui o antigo

Pronto. O card novo aparece na home automaticamente, com filtro e tudo.

## Se quiser editar o estudos.json você mesmo

É uma lista. Cada estudo é um bloco entre chaves `{ }`, separado por vírgula.
Coloque o mais novo **no topo** (primeiro da lista). Modelo:

```json
{
  "titulo": "Título do estudo",
  "categoria": "treino",
  "data": "Jul · 2026",
  "resumo": "Uma ou duas frases sobre o que o material cobre.",
  "arquivo": "nome-do-arquivo.html"
}
```

Regras:
- **categoria** deve ser uma destas (sem acento, minúsculo): `biomecanica`, `treino`, `nutricao`, `suplementacao`
- **arquivo** é só o nome do arquivo dentro de `estudos/` (sem a pasta)
- Todo bloco, menos o último, termina com vírgula
- Não esqueça as aspas

## Estrutura do site

```
/ (raiz do repositório)
├── index.html       ← a home (não precisa editar)
├── estudos.json     ← a lista de estudos (você atualiza)
└── estudos/
    └── agachamento-vs-legpress.html
```

## Publicar no GitHub Pages
1. Suba `index.html`, `estudos.json` e a pasta `estudos/` para a raiz do repositório.
2. Settings → Pages → branch `main`, pasta `/` (root).
3. Aguarde 2–3 min e teste em aba anônima.

## Observação técnica
Abrir o `index.html` com dois cliques no computador (modo `file://`) **não carrega os cards** — é uma proteção do navegador, e é esperado. No GitHub Pages (ou qualquer servidor) funciona normalmente. Para testar localmente, o Claude pode rodar um servidor simples.
