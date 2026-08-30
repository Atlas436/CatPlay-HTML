// ===== Autenticação de usuários (Supabase / Postgres) =====
// Antes o "banco" era o localStorage; agora os dados ficam de verdade
// num banco na nuvem (Supabase), com senha protegida por hash (bcrypt),
// aplicado direto no banco pelas funções cadastrar_usuario/atualizar_usuario.

var CHAVE_SESSAO = "catplay_sessao";

// CREATE — cadastrar novo usuário
async function cadastrarUsuario(nome, usuario, senha) {
  var resposta = await supabaseClient.rpc("cadastrar_usuario", {
    p_nome: nome.trim(),
    p_usuario: usuario.trim(),
    p_senha: senha,
  });

  if (resposta.error) {
    return { ok: false, erro: "Erro ao cadastrar. Tente novamente." };
  }
  return resposta.data;
}

// READ — validar login
async function autenticar(usuario, senha) {
  var resposta = await supabaseClient.rpc("autenticar_usuario", {
    p_usuario: usuario.trim(),
    p_senha: senha,
  });

  if (resposta.error || !resposta.data.ok) return null;
  return { id: resposta.data.id, nome: resposta.data.nome, usuario: resposta.data.usuario };
}

// UPDATE — editar dados do usuário logado
async function atualizarUsuario(usuarioOriginal, novosDados) {
  var resposta = await supabaseClient.rpc("atualizar_usuario", {
    p_usuario_atual: usuarioOriginal.trim(),
    p_novo_nome: novosDados.nome.trim(),
    p_novo_usuario: novosDados.usuario.trim(),
    p_nova_senha: novosDados.senha || null,
  });

  if (resposta.error) return { ok: false, erro: "Erro ao atualizar. Tente novamente." };
  if (!resposta.data.ok) return resposta.data;
  return {
    ok: true,
    usuario: { id: resposta.data.id, nome: resposta.data.nome, usuario: resposta.data.usuario },
  };
}

// DELETE — excluir conta
async function excluirUsuario(usuario) {
  await supabaseClient.rpc("excluir_usuario", { p_usuario: usuario.trim() });
}

// ===== Sessão do usuário logado (sessionStorage) =====
// A sessão (quem está logado nesta aba) continua local — é só uma
// "lembrança" do navegador. Os dados do usuário em si vêm do banco.
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
