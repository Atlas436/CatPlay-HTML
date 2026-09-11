var SINONIMOS_HUMOR = {
  relaxar: ["relaxar", "tranquilo", "calma", "de boa", "suave", "relax"],
  adrenalina: ["adrenalina", "acao", "emocao", "emocionante", "agito", "susto", "medo"],
  chorar: ["chorar", "triste", "choro", "emocional", "drama"],
  refletir: ["refletir", "pensar", "profundo", "filosofico", "reflexao"],
};

var SINONIMOS_GENERO = {
  terror: ["terror", "assombracao", "horror"],
  romance: ["romance", "amor", "romantico", "paixao"],
  "ficcao-cientifica": ["ficcao cientifica", "sci-fi", "scifi", "espaco", "futuro"],
};

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function encontrarChave(textoNormalizado, dicionario) {
  for (var chave in dicionario) {
    var sinonimos = dicionario[chave];
    for (var i = 0; i < sinonimos.length; i++) {
      if (textoNormalizado.indexOf(sinonimos[i]) !== -1) return chave;
    }
  }
  return null;
}

function formatarResposta(itens, referencia) {
  if (!itens || itens.length === 0) {
    return "Ainda não tenho nada pra " + referencia + " no catálogo. Tenta outro humor ou gênero!";
  }
  var lista = itens
    .slice(0, 4)
    .map(function (item) {
      return "• " + item.titulo + " (" + item.tipo + ")";
    })
    .join("\n");
  return "Combinando com " + referencia + ", que tal:\n" + lista;
}

async function sugerirNaoVistos(sessaoAtual) {
  if (!sessaoAtual) {
    return "Faz login primeiro pra eu poder olhar sua biblioteca! 🐾";
  }

  var minhaBiblioteca = await obterMinhaBiblioteca(sessaoAtual.id);
  var idsNaBiblioteca = minhaBiblioteca
    .map(function (registro) {
      return registro.itens ? registro.itens.id : null;
    })
    .filter(Boolean);

  var resposta = await supabaseClient.from("itens").select("*");
  if (resposta.error) return "Deu ruim pra buscar o catálogo, tenta de novo.";

  var novos = resposta.data.filter(function (item) {
    return idsNaBiblioteca.indexOf(item.id) === -1;
  });

  if (novos.length === 0) {
    return "Uau, parece que você já tem tudo do catálogo na sua biblioteca! 🎉";
  }

  var embaralhados = novos.sort(function () {
    return Math.random() - 0.5;
  });
  return formatarResposta(embaralhados, "coisas que você ainda não tem");
}

async function responderChatbot(mensagem, sessaoAtual) {
  var texto = normalizarTexto(mensagem);

  if (
    texto.indexOf("biblioteca") !== -1 ||
    texto.indexOf("ja vi") !== -1 ||
    texto.indexOf("ainda nao vi") !== -1 ||
    texto.indexOf("algo novo") !== -1
  ) {
    return await sugerirNaoVistos(sessaoAtual);
  }

  var generoChave = encontrarChave(texto, SINONIMOS_GENERO);
  if (generoChave) {
    var itensGenero = await buscarItens("genero", generoChave);
    return formatarResposta(itensGenero, "esse gênero");
  }

  var humorChave = encontrarChave(texto, SINONIMOS_HUMOR);
  if (humorChave) {
    var itensHumor = await buscarItens("humor", humorChave);
    return formatarResposta(itensHumor, "esse humor");
  }

  return (
    "Não entendi bem 🐾 Me conta como você tá se sentindo (tipo \"quero relaxar\" " +
    'ou "tô a fim de chorar") ou um gênero que curte (terror, romance, ficção ' +
    'científica), ou peça "algo novo" que eu vejo o que falta na sua biblioteca!'
  );
}

document.addEventListener("DOMContentLoaded", function () {
  var widget = document.createElement("div");
  widget.innerHTML =
    '<button id="catbot-botao" aria-label="Abrir chat do CatPlay">🐾</button>' +
    '<div id="catbot-painel" hidden>' +
    '<div id="catbot-cabecalho"><strong>Gatbot</strong>' +
    '<button type="button" id="catbot-fechar" class="link">Fechar</button></div>' +
    '<div id="catbot-mensagens"></div>' +
    '<form id="catbot-form">' +
    '<input type="text" id="catbot-input" placeholder="Como você tá se sentindo?" autocomplete="off" />' +
    '<button type="submit" class="botao botao-primario">Enviar</button>' +
    "</form>" +
    "</div>";
  document.body.appendChild(widget);

  var botao = document.getElementById("catbot-botao");
  var painel = document.getElementById("catbot-painel");
  var fechar = document.getElementById("catbot-fechar");
  var form = document.getElementById("catbot-form");
  var input = document.getElementById("catbot-input");
  var mensagens = document.getElementById("catbot-mensagens");

  function adicionarMensagem(texto, autor) {
    var bolha = document.createElement("div");
    bolha.className = "catbot-bolha catbot-" + autor;
    bolha.textContent = texto;
    mensagens.appendChild(bolha);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  botao.addEventListener("click", function () {
    painel.hidden = !painel.hidden;
    if (!painel.hidden && mensagens.childElementCount === 0) {
      adicionarMensagem(
        "Oi! Me conta como você tá se sentindo ou um gênero que curte, que eu recomendo algo do catálogo. 🐾",
        "bot"
      );
    }
  });

  fechar.addEventListener("click", function () {
    painel.hidden = true;
  });

  form.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    var texto = input.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, "usuario");
    input.value = "";

    var sessaoAtual = obterSessao();
    var resposta = await responderChatbot(texto, sessaoAtual);
    adicionarMensagem(resposta, "bot");
  });
});
