// Biblioteca unificada de entretenimento (Supabase)
// Busca itens do catálogo (filmes/livros/jogos) filtrados por humor ou gênero.
async function buscarItens(tipo, valor) {
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
}
