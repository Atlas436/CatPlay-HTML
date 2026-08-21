// ===== "Banco de dados" de usuários (localStorage) =====
// Aviso: senha guardada em texto puro só porque é um protótipo escolar,
// sem back-end/servidor. Num sistema real, a senha nunca fica assim.

var CHAVE_USUARIOS = "catplay_usuarios";
var CHAVE_SESSAO = "catplay_sessao";

function obterUsuarios() {
  var dados = localStorage.getItem(CHAVE_USUARIOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function encontrarUsuario(usuario) {
  var usuarios = obterUsuarios();
  var alvo = usuario.trim().toLowerCase();
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].usuario.toLowerCase() === alvo) return usuarios[i];
  }
  return null;
}

// CREATE — cadastrar novo usuário
function cadastrarUsuario(nome, usuario, senha) {
  if (encontrarUsuario(usuario)) {
    return { ok: false, erro: "Esse nome de usuário já está em uso." };
  }
  var usuarios = obterUsuarios();
  usuarios.push({ nome: nome.trim(), usuario: usuario.trim(), senha: senha });
  salvarUsuarios(usuarios);
  return { ok: true };
}

// READ — validar login
function autenticar(usuario, senha) {
  var encontrado = encontrarUsuario(usuario);
  if (encontrado && encontrado.senha === senha) return encontrado;
  return null;
}

// UPDATE — editar dados do usuário logado
function atualizarUsuario(usuarioOriginal, novosDados) {
  var usuarios = obterUsuarios();
  var alvo = usuarioOriginal.trim().toLowerCase();

  // impede trocar para um nome de usuário que já existe (de outra conta)
  if (novosDados.usuario.trim().toLowerCase() !== alvo) {
    var conflito = encontrarUsuario(novosDados.usuario);
    if (conflito) return { ok: false, erro: "Esse nome de usuário já está em uso." };
  }

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].usuario.toLowerCase() === alvo) {
      usuarios[i].nome = novosDados.nome.trim();
      usuarios[i].usuario = novosDados.usuario.trim();
      if (novosDados.senha) usuarios[i].senha = novosDados.senha;
      salvarUsuarios(usuarios);
      return { ok: true, usuario: usuarios[i] };
    }
  }
  return { ok: false, erro: "Usuário não encontrado." };
}

// DELETE — excluir conta
function excluirUsuario(usuario) {
  var usuarios = obterUsuarios();
  var alvo = usuario.trim().toLowerCase();
  var restantes = usuarios.filter(function (u) {
    return u.usuario.toLowerCase() !== alvo;
  });
  salvarUsuarios(restantes);
}

// ===== Sessão do usuário logado (sessionStorage) =====
function definirSessao(usuario) {
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
}

function obterSessao() {
  var dados = sessionStorage.getItem(CHAVE_SESSAO);
  return dados ? JSON.parse(dados) : null;
}

function encerrarSessao() {
  sessionStorage.removeItem(CHAVE_SESSAO);
}

// Protege páginas que exigem login; chame no topo do <script> da página
function exigirLogin() {
  var sessao = obterSessao();
  if (!sessao) {
    window.location.href = "index.html";
  }
  return sessao;
}
