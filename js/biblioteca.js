// Biblioteca unificada de entretenimento (Supabase)
// Busca itens do catálogo (filmes/livros/jogos) filtrados por humor ou gênero.
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

// ===== Recomendação cruzada entre mídias =====
// "Gostou desse filme? aqui livros/jogos parecidos" — cruza gênero,
// humores e tags em comum, só com itens de um TIPO diferente do original.
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

// ===== Biblioteca pessoal (o que o usuário já assistiu/leu/jogou) =====

// Adiciona (ou atualiza, se já existir) um item na biblioteca pessoal
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

// Busca a biblioteca pessoal do usuário, já com os dados do item juntos
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

// Atualiza o status de um item já salvo na biblioteca pessoal
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

// Remove um item da biblioteca pessoal
async function removerDaBiblioteca(registroId) {
  try {
    var resposta = await supabaseClient.from("biblioteca_pessoal").delete().eq("id", registroId);
    return !resposta.error;
  } catch (excecao) {
    console.error("Falha de conexão ao remover da biblioteca:", excecao);
    return false;
  }
}
