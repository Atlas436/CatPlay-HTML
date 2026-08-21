# CatPlay+ (versão HTML puro) 🐾

Protótipo (MVP) de uma aplicação web para recomendação de mídias — **Jogos**, **Livros** e **Filmes/Séries** — a partir do humor ou do gênero preferido do usuário.

Esta é a versão em **HTML + CSS + JavaScript puro**, sem framework e sem etapa de build — é só abrir o `index.html` no navegador. Existe também uma [versão em React](https://github.com/Atlas436/CatPlay), feita antes desta.

## Login e CRUD de usuários

Diferente da versão React, esta versão tem **login com usuário e senha** e um **CRUD completo de usuários**, guardado no `localStorage` do navegador (funciona como um "banco de dados" local, já que não há servidor/back-end):

| Operação | Onde acontece | Arquivo |
| --- | --- | --- |
| **C**reate | Tela "Criar conta" | `cadastro.html` |
| **R**ead | Tela de login (valida usuário/senha) | `index.html` |
| **U**pdate | Tela "Meu perfil" → Salvar alterações | `perfil.html` |
| **D**elete | Tela "Meu perfil" → Excluir conta | `perfil.html` |

Toda a lógica de CRUD fica centralizada em `js/auth.js`.

> ⚠️ **Aviso didático:** a senha é guardada em texto puro no `localStorage` só porque isto é um protótipo escolar sem back-end de verdade. Num sistema em produção, senha nunca deve ser guardada assim (o certo seria hash + salt num banco de dados real, do lado do servidor).

## Fluxo da aplicação

1. **Login/Cadastro** (`index.html` / `cadastro.html`) — usuário entra ou cria uma conta.
2. **Modo de busca** (`mode.html`) — escolhe entre recomendação **Por Humor** ou **Por Gênero**.
3. **Escolha específica** (`derivation.html`):
   - Por Humor: "Para relaxar", "Em busca de adrenalina", "Para chorar" ou "Para refletir".
   - Por Gênero: Terror/Suspense, Romance ou Ficção Científica.
4. **Resultados** (`results.html`) — recomendações organizadas por tipo de mídia, com título, tipo, sinopse e tags. Botão para recomeçar.
5. **Meu perfil** (`perfil.html`) — editar nome/usuário/senha ou excluir a conta.

A navegação entre telas é feita por **links normais entre páginas HTML**, passando a escolha do usuário pela URL (`?tipo=humor&valor=relaxar`, por exemplo). Quem está logado fica guardado no `sessionStorage` (dura enquanto a aba estiver aberta).

## Tecnologias

- HTML5
- CSS3 (com variáveis CSS para a paleta de cores — sem framework)
- JavaScript puro (Vanilla JS, sem bibliotecas)
- `localStorage` (usuários) e `sessionStorage` (sessão de quem está logado)

## Paleta de cores

Extraída da logo (gato lendo + patinha), definida em `css/style.css`:

| Cor | Uso | Hex |
| --- | --- | --- |
| Creme | Fundo | `#F5EEDC` |
| Laranja (primária) | Botões principais, destaques | `#DB8354` |
| Verde-sálvia (secundária) | Botões secundários, tags | `#B9C99D` |
| Marrom (destaque) | Títulos, contornos | `#6B3021` |

## Como rodar

Não precisa instalar nada nem rodar comandos. Basta:

1. Baixar/clonar este repositório.
2. Abrir o arquivo `index.html` diretamente no navegador (duplo clique) — ou, se preferir, servir a pasta com qualquer servidor estático simples, por exemplo:

```bash
# Python 3
python3 -m http.server 8000

# depois acesse http://localhost:8000
```

## Como publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, selecione **Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Salve. O site fica disponível em `https://<seu-usuário>.github.io/<nome-do-repositório>/`.

## Estrutura do projeto

```
├── index.html         # Tela de login (Read)
├── cadastro.html       # Tela de cadastro (Create)
├── mode.html           # Tela 2: Por Humor / Por Gênero
├── derivation.html      # Tela 3: cards de humor ou gênero
├── results.html         # Tela 4: recomendações
├── perfil.html          # CRUD: editar (Update) e excluir (Delete) conta
├── css/
│   └── style.css        # estilos e paleta de cores
├── js/
│   ├── data.js           # catálogo de recomendações (15 itens)
│   └── auth.js           # CRUD de usuários + sessão (login/logout)
└── assets/
    └── logo.svg
```
