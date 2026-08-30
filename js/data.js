// Configuração de interface (rótulos e emojis).
// Os itens da biblioteca (filmes/livros/jogos) agora vêm do Supabase,
// não ficam mais fixos aqui — veja js/biblioteca.js.

var HUMORES = [
  { chave: "relaxar", rotulo: "Para relaxar", emoji: "🌿" },
  { chave: "adrenalina", rotulo: "Em busca de adrenalina", emoji: "⚡" },
  { chave: "chorar", rotulo: "Para chorar", emoji: "💧" },
  { chave: "refletir", rotulo: "Para refletir", emoji: "🌙" },
];

var GENEROS = [
  { chave: "terror", rotulo: "Terror/Suspense", emoji: "🎃" },
  { chave: "romance", rotulo: "Romance", emoji: "💕" },
  { chave: "ficcao-cientifica", rotulo: "Ficção Científica", emoji: "🚀" },
];

var TIPOS_MIDIA = ["Jogo", "Livro", "Filme/Série"];

var ROTULOS_TIPO = {
  Jogo: "Jogos",
  Livro: "Livros",
  "Filme/Série": "Filmes / Séries",
};
