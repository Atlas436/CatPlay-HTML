async function buscarItens(tipo, valor) {
  try {
    var consulta = supabaseClient.from("itens").select("*");

    if (tipo === "humor") {
      consulta = consulta.contains("humores", [valor]);
    } else {
      consulta = consulta.eq("genero", valor);
    }

    var resposta = await consulta;
    if (resposta.error) {
      console.error("Erro ao buscar itens:", resposta.error);
      return [];
    }
    return resposta.data;
  } catch (excecao) {
    console.error("Falha de conexão ao buscar itens:", excecao);
    return [];
  }
}

async function buscarRecomendacoesCruzadas(item) {
  try {
    var resposta = await supabaseClient.from("itens").select("*").neq("id", item.id);

    if (resposta.error) {
      console.error("Erro ao buscar recomendações cruzadas:", resposta.error);
      return [];
    }

    var candidatos = resposta.data.filter(function (candidato) {
      return candidato.tipo !== item.tipo;
    });

    candidatos.forEach(function (candidato) {
      var pontuacao = 0;
      if (candidato.genero === item.genero) pontuacao += 2;
      candidato.humores.forEach(function (h) {
        if (item.humores.indexOf(h) !== -1) pontuacao += 1;
      });
      candidato.tags.forEach(function (t) {
        if (item.tags.indexOf(t) !== -1) pontuacao += 1;
      });
      candidato._pontuacao = pontuacao;
    });

    return candidatos
      .filter(function (c) {
        return c._pontuacao > 0;
      })
      .sort(function (a, b) {
        return b._pontuacao - a._pontuacao;
      })
      .slice(0, 3);
  } catch (excecao) {
    console.error("Falha de conexão ao buscar recomendações cruzadas:", excecao);
    return [];
  }
}

async function adicionarNaBiblioteca(usuarioId, itemId, status) {
  try {
    var resposta = await supabaseClient.from("biblioteca_pessoal").upsert(
      {
        usuario_id: usuarioId,
        item_id: itemId,
        status: status,
        atualizado_em: new Date().toISOString(),
      },
      { onConflict: "usuario_id,item_id" }
    );
    return !resposta.error;
  } catch (excecao) {
    console.error("Falha de conexão ao adicionar na biblioteca:", excecao);
    return false;
  }
}

async function obterMinhaBiblioteca(usuarioId) {
  try {
    var resposta = await supabaseClient
      .from("biblioteca_pessoal")
      .select("id, status, progresso, itens(*)")
      .eq("usuario_id", usuarioId)
      .order("atualizado_em", { ascending: false });

    if (resposta.error) {
      console.error("Erro ao buscar biblioteca pessoal:", resposta.error);
      return [];
    }
    return resposta.data;
  } catch (excecao) {
    console.error("Falha de conexão ao buscar biblioteca pessoal:", excecao);
    return [];
  }
}

async function atualizarStatusBiblioteca(registroId, status) {
  try {
    var resposta = await supabaseClient
      .from("biblioteca_pessoal")
      .update({ status: status, atualizado_em: new Date().toISOString() })
      .eq("id", registroId);
    return !resposta.error;
  } catch (excecao) {
    console.error("Falha de conexão ao atualizar status:", excecao);
    return false;
  }
}

async function removerDaBiblioteca(registroId) {
  try {
    var resposta = await supabaseClient.from("biblioteca_pessoal").delete().eq("id", registroId);
    return !resposta.error;
  } catch (excecao) {
    console.error("Falha de conexão ao remover da biblioteca:", excecao);
    return false;
  }
}
