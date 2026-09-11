// Faixa lateral decorativa — injetada via JS (mais confiável que CSS puro)
// e com altura recalculada sempre que o conteúdo da página muda de tamanho
// (ex: quando os cards do catálogo chegam do Supabase depois do carregamento).
(function () {
  var faixa = document.createElement("div");
  faixa.className = "faixa-lateral";
  faixa.setAttribute("aria-hidden", "true");

  var trilho = document.createElement("div");
  trilho.className = "faixa-lateral-trilho";

  var texto = "★ CATPLAY ".repeat(80);
  var copia1 = document.createElement("div");
  copia1.className = "faixa-lateral-copia";
  copia1.textContent = texto;
  var copia2 = document.createElement("div");
  copia2.className = "faixa-lateral-copia";
  copia2.textContent = texto;

  trilho.appendChild(copia1);
  trilho.appendChild(copia2);
  faixa.appendChild(trilho);
  document.body.appendChild(faixa);

  // As duas cópias são idênticas e cada uma tem a altura exata da página,
  // então animar o trilho de translateY(0) até translateY(-50%) — metade
  // da altura total do trilho, ou seja, uma cópia inteira — faz o loop
  // fechar sem deixar vão: no instante do "reset" a cópia 2 está mostrando
  // exatamente o que a cópia 1 mostrava no início.
  function ajustarAltura() {
    var altura = document.documentElement.scrollHeight;
    faixa.style.height = altura + "px";
    copia1.style.height = altura + "px";
    copia2.style.height = altura + "px";
    trilho.style.animationDuration = Math.max(altura / 70, 6) + "s";
  }

  window.addEventListener("load", ajustarAltura);
  window.addEventListener("resize", ajustarAltura);

  var observador = new MutationObserver(ajustarAltura);
  observador.observe(document.body, { childList: true, subtree: true });

  ajustarAltura();
})();
