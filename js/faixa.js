// Faixa lateral decorativa — injetada via JS (mais confiável que CSS puro)
// e com altura recalculada sempre que o conteúdo da página muda de tamanho
// (ex: quando os cards do catálogo chegam do Supabase depois do carregamento).
(function () {
  var faixa = document.createElement("div");
  faixa.className = "faixa-lateral";
  faixa.setAttribute("aria-hidden", "true");
  faixa.textContent = "★ CATPLAY ".repeat(60);
  document.body.appendChild(faixa);

  function ajustarAltura() {
    faixa.style.height = document.documentElement.scrollHeight + "px";
  }

  window.addEventListener("load", ajustarAltura);
  window.addEventListener("resize", ajustarAltura);

  var observador = new MutationObserver(ajustarAltura);
  observador.observe(document.body, { childList: true, subtree: true });

  ajustarAltura();
})();
