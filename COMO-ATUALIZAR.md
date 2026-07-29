# Biblioteca MG COACH — índice recolhível + CSS e JS compartilhados

Atualização geral: **todos os 82 materiais**.

---

## ⚠️ LEIA ANTES DE SUBIR

Os materiais agora dependem de **dois arquivos novos**: `mgcoach.css` e `mgcoach.js`.

**Se você subir só os HTMLs e esquecer esses dois, a biblioteca inteira fica sem estilo nenhum.**

Suba tudo junto. O jeito mais seguro é substituir o repositório inteiro de uma vez.

---

## 1. O índice agora recolhe

Era o pedido original. O índice de tópicos ficava dentro do cabeçalho `sticky` e ocupava metade da tela o tempo todo.

| | Cabeçalho | Da tela do celular |
|---|---|---|
| Antes | 370–578 px | 44% a 68% |
| Agora | 100 px | 12% |

- Vem **fechado**, com um botão mostrando `Índice · N seções`
- Um toque abre, a setinha gira
- **Ao escolher um tópico, fecha sozinho** — você cai na seção com a tela livre
- Lembra sua preferência entre materiais e visitas

### Salto instantâneo

Nos materiais longos, pular para uma seção distante percorria mais de 46.000 px de rolagem animada — vários segundos. Agora o salto pelo índice é instantâneo e posicionado, com o título parando logo abaixo do cabeçalho.

---

## 2. CSS e JS agora são compartilhados

Antes, cada material carregava sua própria cópia de ~9 KB de CSS e ~1 KB de JS. Qualquer ajuste visual significava editar 82 arquivos.

Agora existem `mgcoach.css` e `mgcoach.js`, e todo material aponta para eles.

### O que isso muda

| | Antes | Depois |
|---|---|---|
| Tamanho total dos HTMLs | 2,96 MB | 2,20 MB |
| Primeira visita a um material | 37 KB | 44 KB |
| **Visitas seguintes** (css/js em cache) | 37 KB | **27 KB** |
| Mudar algo no visual | editar 82 arquivos | **editar 1 arquivo** |

A primeira visita fica levemente maior porque baixa os três arquivos. Da segunda em diante, o navegador reaproveita o CSS e o JS e cada material fica **27% mais leve**.

---

## 3. Defeitos corrigidos no caminho

| Defeito | Onde | O que era |
|---|---|---|
| **Tags de fechamento duplicadas** | 35 materiais | `</body>` e `</html>` repetidos de 2 a 4 vezes. HTML inválido, herdado do template original. |
| **`ol.key li b` com `color:#fff`** | 13 materiais | Texto em negrito dentro das listas numeradas ficava branco no branco, **ilegível no tema claro**. |
| **Colisão de classe `.serie-bar`** | 6 materiais | A série postural usava esse nome para outra coisa; 66 materiais já usavam para uma barra de pills. Renomeada para `.parte-bar`. |
| **Material sem link de volta** | `agachamento-vs-legpress.html` | Não tinha o `← Biblioteca`. Beco sem saída. Adicionado. |

---

## 4. O que mudou de aparência — e onde

A biblioteca tinha **17 variações diferentes de CSS**, resultado de o padrão ter evoluído ao longo do tempo. O arquivo compartilhado adota a variação usada em **60 dos 82** materiais.

**67 materiais ficaram pixel-idênticos.**

**15 materiais mudaram de forma sutil:**

- `h2` de 26 px para 25 px
- Título do hero um pouco menor (a maioria de 32 px para 30 px; um de 34 px)
- Fundo das caixas `.def` levemente mais laranja

Arquivos afetados: `agachamento-gluteo-livre-vs-smith`, `agachamento-vs-legpress`, `ciclo-de-carboidratos`, `contracao-muscular`, `creatina-superestimada`, `dor-lombar-core-gluteos`, `forca-e-hipertrofia`, `hipertrofia-biceps-braquial`, `hipertrofia-regional-gluteo`, `hipertrofia-triceps-overhead`, `perfil-de-resistencia`, `posicao-dos-pes-leg-press`, `pre-treinos-subdosados`, `testosterona-natural`, `volume-de-treino`.

Na prática isso **unifica a identidade visual**, que estava com deriva. Mas é uma mudança real — se você preferir manter algum deles como estava, me avisa que eu devolvo o tamanho original só para ele.

---

## 5. Como subir

O mais seguro é substituir tudo:

1. Descompacte o ZIP
2. Em `github.com/mgcoach/materialdeestudo-`, **Add file → Upload files**
3. Arraste **todo o conteúdo** da pasta
4. Marque **Replace** onde pedir
5. **Commit changes**
6. Aguarde 2–3 minutos
7. Teste em **aba anônima** (para não pegar cache antigo)

### Confira depois de subir

- [ ] Um material abre com fundo preto e o laranja da marca
- [ ] O botão `Índice · N seções` aparece e abre/fecha
- [ ] Clicar num tópico salta e recolhe o índice
- [ ] O tema claro/escuro alterna
- [ ] O `← Biblioteca` volta para a home
- [ ] A home lista 82 materiais e a busca no conteúdo indexa

---

## 6. Daqui pra frente

Para mudar qualquer coisa no visual da biblioteca inteira — cor, fonte, espaçamento, um bloco novo —, agora é **um arquivo**: `mgcoach.css`.

Materiais novos devem seguir este padrão:

```html
<head>
  <meta charset="UTF-8">
  <script>(function(){try{var t=localStorage.getItem("mgcoach-theme");
    if(t==="light")document.documentElement.setAttribute("data-theme","light");}catch(e){}})();</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>...</title>
  <!-- bloco OG -->
  <link rel="stylesheet" href="mgcoach.css">
</head>
```

E, antes do `</body>`:

```html
<script src="mgcoach.js"></script>
```

O script curto do `<head>` **continua inline de propósito** — ele aplica o tema antes da página pintar, evitando o flash branco ao abrir no tema claro.

O cabeçalho precisa ter a barra do índice e o `id="tocNav"` no nav. O `mgcoach.js` conta as seções sozinho e monta o rótulo.

---

## Validação executada

Nos 82 materiais, servidos por HTTP, com contexto de navegador limpo a cada arquivo:

- `html.parser` sem erros
- CSS aplicando (fundo `rgb(10,10,10)`)
- Índice fechado por padrão, abrindo e fechando
- Cabeçalho crescendo ao abrir o índice
- Salto para a **última seção** de cada material caindo na posição certa
- Índice recolhendo ao clicar num tópico
- Tema claro/escuro alternando
- **Zero erro de JavaScript**

Além disso: comparação de estilos computados contra a versão original em 8 materiais de amostra, home listando 82, busca no conteúdo indexando os 82 e retornando resultados com links de seção corretos, e o `← Biblioteca` navegando de volta.
