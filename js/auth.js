var CHAVE_SESSAO = "catplay_sessao";

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

async function autenticar(usuario, senha) {
  var resposta = await supabaseClient.rpc("autenticar_com_token", {
    p_usuario: usuario.trim(),
    p_senha: senha,
  });

  if (resposta.error || !resposta.data.ok) return null;
  return {
    id: resposta.data.id,
    nome: resposta.data.nome,
    usuario: resposta.data.usuario,
    token: resposta.data.token,
  };
}

async function atualizarUsuario(usuarioOriginal, senhaAtual, novosDados) {
  var resposta = await supabaseClient.rpc("atualizar_usuario", {
    p_usuario_atual: usuarioOriginal.trim(),
    p_senha_atual: senhaAtual,
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

async function excluirUsuario(usuario, senha) {
  var resposta = await supabaseClient.rpc("excluir_usuario", {
    p_usuario: usuario.trim(),
    p_senha: senha,
  });

  if (resposta.error) return { ok: false, erro: "Erro ao excluir. Tente novamente." };
  return resposta.data;
}

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

function exigirLogin() {
  var sessao = obterSessao();
  if (!sessao) {
    window.location.href = "index.html";
  }
  return sessao;
}
