(function () {
  var linksNav = document.querySelectorAll(".barra-topo nav a");
  var paginaAtual = window.location.pathname.split("/").pop();
  linksNav.forEach(function (link) {
    if (link.getAttribute("href") === paginaAtual) {
      link.classList.add("ativo");
    }
  });
})();
