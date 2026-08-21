// Catálogo de recomendações (dados fixos, simulando um banco de dados)
var CATALOGO = [
  {
    id: 1,
    titulo: "Resident Evil Village",
    tipo: "Jogo",
    genero: "terror",
    humores: ["adrenalina"],
    sinopse:
      "Ethan Winters enfrenta criaturas monstruosas e uma vilania sombria numa vila europeia amaldiçoada, em busca de sua filha desaparecida.",
    tags: ["survival horror", "ação", "exploração"],
  },
  {
    id: 2,
    titulo: "It: A Coisa",
    tipo: "Livro",
    genero: "terror",
    humores: ["refletir", "adrenalina"],
    sinopse:
      "Stephen King narra o terror que assombra a cidade de Derry, personificado pelo palhaço Pennywise, e a coragem de um grupo de amigos para enfrentá-lo.",
    tags: ["clássico", "Stephen King", "palhaço"],
  },
  {
    id: 3,
    titulo: "Invocação do Mal",
    tipo: "Filme/Série",
    genero: "terror",
    humores: ["adrenalina"],
    sinopse:
      "Baseado em casos reais, o casal Warren investiga uma fazenda assombrada por uma presença sombria que ameaça a família Perron.",
    tags: ["baseado em fatos reais", "assombração", "tensão"],
  },
  {
    id: 4,
    titulo: "Hereditário",
    tipo: "Filme/Série",
    genero: "terror",
    humores: ["chorar", "refletir"],
    sinopse:
      "Após a morte da avó, uma família começa a desvendar segredos sombrios e traumas que ameaçam destruí-la por dentro.",
    tags: ["drama sombrio", "luto", "culto"],
  },
  {
    id: 5,
    titulo: "Outlast",
    tipo: "Jogo",
    genero: "terror",
    humores: ["adrenalina", "refletir"],
    sinopse:
      "Um jornalista investiga um hospício abandonado e precisa fugir, filmar e se esconder de pacientes aterrorizantes pelos corredores escuros.",
    tags: ["survival horror", "found footage", "terror psicológico"],
  },
  {
    id: 6,
    titulo: "Orgulho e Preconceito",
    tipo: "Livro",
    genero: "romance",
    humores: ["relaxar", "refletir"],
    sinopse:
      "Jane Austen narra o embate de personalidades entre Elizabeth Bennet e o orgulhoso Sr. Darcy na Inglaterra do século XIX.",
    tags: ["clássico", "época", "slow burn"],
  },
  {
    id: 7,
    titulo: "Simplesmente Amor",
    tipo: "Filme/Série",
    genero: "romance",
    humores: ["relaxar", "chorar"],
    sinopse:
      "Diversas histórias de amor se entrelaçam em Londres durante as semanas que antecedem o Natal.",
    tags: ["comédia romântica", "natal", "multi-histórias"],
  },
  {
    id: 8,
    titulo: "Florence",
    tipo: "Jogo",
    genero: "romance",
    humores: ["relaxar"],
    sinopse:
      "Um jogo narrativo minimalista que conta, através de mini-jogos, a jornada emocional do primeiro grande amor de Florence.",
    tags: ["visual novel", "minimalista", "emocionante"],
  },
  {
    id: 9,
    titulo: "A Culpa é das Estrelas",
    tipo: "Livro",
    genero: "romance",
    humores: ["chorar", "refletir"],
    sinopse:
      "Dois adolescentes com câncer se apaixonam enquanto encaram a vida, o destino e o tempo que lhes resta.",
    tags: ["John Green", "drama", "superação"],
  },
  {
    id: 10,
    titulo: "Diário de uma Paixão",
    tipo: "Filme/Série",
    genero: "romance",
    humores: ["chorar"],
    sinopse:
      "Um casal enfrenta diferenças sociais e a passagem do tempo para viver uma história de amor que atravessa décadas.",
    tags: ["clássico romântico", "nostalgia", "drama"],
  },
  {
    id: 11,
    titulo: "Mass Effect 2",
    tipo: "Jogo",
    genero: "ficcao-cientifica",
    humores: ["adrenalina", "refletir"],
    sinopse:
      "O Comandante Shepard reúne uma equipe de elite para uma missão suicida contra uma ameaça alienígena que coloca a galáxia em risco.",
    tags: ["space opera", "RPG", "escolhas"],
  },
  {
    id: 12,
    titulo: "Admirável Mundo Novo",
    tipo: "Livro",
    genero: "ficcao-cientifica",
    humores: ["refletir"],
    sinopse:
      "Aldous Huxley imagina uma sociedade futurista controlada pela genética e pelo condicionamento, onde a felicidade é imposta a todos.",
    tags: ["distopia", "clássico", "filosófico"],
  },
  {
    id: 13,
    titulo: "Interestelar",
    tipo: "Filme/Série",
    genero: "ficcao-cientifica",
    humores: ["refletir", "adrenalina"],
    sinopse:
      "Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",
    tags: ["espaço", "drama", "épico"],
  },
  {
    id: 14,
    titulo: "Cyberpunk 2077",
    tipo: "Jogo",
    genero: "ficcao-cientifica",
    humores: ["adrenalina", "refletir"],
    sinopse:
      "Em Night City, um mercenário busca um implante capaz de garantir a imortalidade, em meio a corporações poderosas e tecnologia de ponta.",
    tags: ["cyberpunk", "mundo aberto", "RPG"],
  },
  {
    id: 15,
    titulo: "O Guia do Mochileiro das Galáxias",
    tipo: "Livro",
    genero: "ficcao-cientifica",
    humores: ["relaxar", "refletir"],
    sinopse:
      "Um humano comum é resgatado momentos antes da destruição da Terra e embarca em uma jornada intergaláctica cheia de humor e absurdos.",
    tags: ["ficção cômica", "clássico", "aventura espacial"],
  },
];

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
