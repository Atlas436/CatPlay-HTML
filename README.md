# CatPlay+ (versão HTML puro) 🐾

Protótipo de uma aplicação web para recomendação de mídias — **Jogos**, **Livros** e **Filmes/Séries** — a partir do humor ou do gênero preferido do usuário, com recomendação cruzada entre tipos de mídia e um chatbot de IA integrado ao catálogo.

Esta é a versão em **HTML + CSS + JavaScript puro**, sem framework e sem etapa de build — é só abrir o `index.html` no navegador. Existe também uma [versão em React](https://github.com/Atlas436/CatPlay), feita antes desta.

## Login e CRUD de usuários

Login com usuário e senha e um **CRUD completo de usuários**, guardado num banco de dados real (Postgres, via Supabase):

| Operação | Onde acontece | Arquivo |
| --- | --- | --- |
| **C**reate | Tela "Criar conta" | `cadastro.html` |
| **R**ead | Tela de login (valida usuário/senha) | `index.html` |
| **U**pdate | Tela "Meu perfil" → Salvar alterações (exige a senha atual) | `perfil.html` |
| **D**elete | Tela "Meu perfil" → Excluir conta (exige a senha) | `perfil.html` |

Toda a lógica de CRUD fica centralizada em `js/auth.js`, chamando funções do banco (`cadastrar_usuario`, `autenticar_usuario`, `atualizar_usuario`, `excluir_usuario`) que já cuidam do hash de senha (bcrypt, via `pgcrypto`) e exigem a senha atual antes de editar ou excluir a conta.

> ⚠️ **Limitação conhecida:** a tabela `biblioteca_pessoal` (o que cada usuário marcou como "quero ver"/"em andamento"/"concluído") está com uma regra de segurança (RLS) aberta — qualquer pessoa com a chave pública do projeto consegue ler ou editar os registros de qualquer usuário, não só os próprios. Isso existe porque o projeto não usa o sistema de autenticação completo do Supabase (só uma tabela `usuarios` própria com funções customizadas), então não há como o banco saber sozinho "quem está pedindo isso" pra restringir por usuário. Resolver isso direito exigiria migrar pro Supabase Auth — fora do escopo deste protótipo, mas registrado aqui de propósito (mesma lógica do aviso antigo sobre senha em texto puro: é melhor documentar uma limitação conhecida do que escondê-la).

## Biblioteca unificada e biblioteca pessoal

O catálogo de itens (filmes/séries, livros e jogos) vive numa única tabela (`itens`) no Supabase, com gênero, humores e tags. Cada usuário logado pode marcar qualquer item como parte da sua **biblioteca pessoal** ("Quero ver" / "Em andamento" / "Concluído") direto na tela de resultados, e acompanhar tudo em `biblioteca.html`.

## Recomendação cruzada entre mídias

Em cada card de resultado, o botão **"Ver parecidos"** busca itens de um **tipo de mídia diferente** do original (ex: gostou de um filme → sugere livros e jogos parecidos), pontuando por gênero, humores e tags em comum (`buscarRecomendacoesCruzadas` em `js/biblioteca.js`).

## Chatbot de IA — Gatbot

O **Gatbot**, chatbot flutuante (ícone 🐾 no canto da tela, em toda página logada), reconhece humor/gênero por palavras-chave e responde usando o catálogo real do banco — nada de resposta solta. Também entende pedidos tipo "me indica algo novo", cruzando o catálogo com a biblioteca pessoal do usuário pra sugerir só o que ele ainda não tem. Lógica baseada em regras simples (dicionário de sinônimos + busca no banco), sem modelo de IA pesado — ver `js/chatbot.js`.

## Fluxo da aplicação

1. **Login/Cadastro** (`index.html` / `cadastro.html`) — usuário entra ou cria uma conta.
2. **Modo de busca** (`mode.html`) — escolhe entre recomendação **Por Humor** ou **Por Gênero**.
3. **Escolha específica** (`derivation.html`):
   - Por Humor: "Para relaxar", "Em busca de adrenalina", "Para chorar" ou "Para refletir".
   - Por Gênero: Terror/Suspense, Romance ou Ficção Científica.
4. **Resultados** (`results.html`) — recomendações organizadas por tipo de mídia, com título, tipo, sinopse, tags, botão pra adicionar à biblioteca pessoal e botão "Ver parecidos" (recomendação cruzada).
5. **Minha biblioteca** (`biblioteca.html`) — tudo que o usuário já assistiu/leu/jogou (ou pretende), com status editável.
6. **Meu perfil** (`perfil.html`) — editar nome/usuário/senha ou excluir a conta.

Em qualquer uma dessas páginas (exceto login/cadastro), o chatbot fica disponível no canto da tela.

A navegação entre telas é feita por **links normais entre páginas HTML**, passando a escolha do usuário pela URL (`?tipo=humor&valor=relaxar`, por exemplo). Quem está logado fica guardado no `sessionStorage` (dura enquanto a aba estiver aberta) — os dados do usuário em si vêm do banco.

## Tecnologias

- HTML5
- CSS3 (variáveis CSS para a paleta, sem framework)
- JavaScript puro (Vanilla JS) + o cliente oficial do [Supabase](https://supabase.com) (`@supabase/supabase-js`, hospedado localmente em `js/vendor/supabase.js`)
- **Supabase (Postgres)** como banco de dados real — tabelas `usuarios`, `itens` e `biblioteca_pessoal`, com PK/FK e funções SQL (`pgcrypto` pra hash de senha)
- `sessionStorage` só pra saber quem está logado nesta aba (os dados do usuário ficam no banco)

## Banco de dados

Três tabelas relacionais no Supabase/Postgres:

- **`usuarios`** — id (PK), nome, usuario (único), senha_hash.
- **`itens`** — id (PK), titulo, tipo, genero, sinopse, humores (lista), tags (lista) — a biblioteca unificada.
- **`biblioteca_pessoal`** — id (PK), usuario_id (FK → usuarios), item_id (FK → itens), status, progresso — liga usuário e item.

## Paleta de cores

Visual brutalista (fundo escuro, alto contraste, tipografia pesada), definida em `css/style.css`:

| Cor | Uso | Hex |
| --- | --- | --- |
| Preto | Fundo, texto sobre branco | `#111111` |
| Creme | Texto sobre fundo escuro, cartões | `#F4F1EA` |
| Vermelho | Cor dominante — sombras duras, faixa lateral, destaques | `#FF2B1F` |
| Laranja | Botões primários | `#FF6C1A` |
| Amarelo | Selos, tags de tipo | `#FFD400` |

## Como rodar

Não precisa instalar nada nem rodar comandos. Basta:

1. Baixar/clonar este repositório.
2. Abrir o arquivo `index.html` diretamente no navegador (duplo clique) — ou, se preferir, servir a pasta com qualquer servidor estático simples, por exemplo:

```bash
# Python 3
python3 -m http.server 8000

# depois acesse http://localhost:8000
```

As credenciais do Supabase (URL + chave pública) já estão em `js/supabaseClient.js` — não precisa configurar nada extra pra o site funcionar.

## Como publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, selecione **Deploy from a branch**.
3. Escolha a branch onde o projeto está de verdade e a pasta `/ (root)`.
4. Salve. O site fica disponível em `https://<seu-usuário>.github.io/<nome-do-repositório>/`.

## MVP separado

O arquivo `mvp/index.html` é um protótipo autocontido (feito por uma colaboradora do time), com dados simulados em memória — não usa o Supabase. Serve como demonstração rápida do conceito, acessível pelo botão "Ver MVP" na tela de login.

## Estrutura do projeto

```
├── index.html            # Tela de login (Read)
├── cadastro.html         # Tela de cadastro (Create)
├── mode.html             # Tela 2: Por Humor / Por Gênero
├── derivation.html       # Tela 3: cards de humor ou gênero
├── results.html          # Tela 4: recomendações + biblioteca pessoal + recomendação cruzada
├── biblioteca.html       # Minha biblioteca (histórico pessoal)
├── perfil.html           # CRUD: editar (Update) e excluir (Delete) conta
├── mvp/
│   └── index.html        # Protótipo autocontido, dados fake, sem Supabase
├── css/
│   └── style.css         # estilos, paleta brutalista, transições
├── js/
│   ├── vendor/
│   │   └── supabase.js     # biblioteca oficial do Supabase (hospedada local)
│   ├── supabaseClient.js   # conexão com o projeto Supabase
│   ├── data.js              # rótulos de interface (humores, gêneros, status)
│   ├── biblioteca.js         # catálogo, biblioteca pessoal, recomendação cruzada
│   ├── auth.js                # CRUD de usuários + sessão (login/logout)
│   ├── chatbot.js              # chatbot flutuante baseado em regras
│   ├── nav.js                   # destaca a página ativa no menu
│   └── faixa.js                  # faixa lateral decorativa
└── assets/
    ├── logo.jpg           # logo completo (gato + "CatPlay+")
    ├── favicon.png        # recorte do gato, usado no cabeçalho e na aba
    ├── textura-fundo.svg  # esfera wireframe decorativa
    └── carinhas-fundo-*.svg # assinatura do time espalhada pelo fundo
```
