document.addEventListener('DOMContentLoaded', () => {
  const btnFiltro = document.getElementById('btnFiltro');
  const menuFiltro = document.getElementById('menuFiltro');
  const btnFecharFiltro = document.getElementById('btnFecharFiltro');

  btnFiltro.addEventListener('click', () => {
    menuFiltro.classList.add('aberto');
    menuFiltro.setAttribute('aria-hidden', 'false');
    btnFiltro.setAttribute('aria-expanded', 'true');
  });

  btnFecharFiltro.addEventListener('click', () => {
    menuFiltro.classList.remove('aberto');
    menuFiltro.setAttribute('aria-hidden', 'true');
    btnFiltro.setAttribute('aria-expanded', 'false');
  });

  // Toggle das seções do filtro
  function toggleFiltro(element) {
    const opcoes = element.nextElementSibling;
    const isAberto = opcoes.classList.toggle('aberto');
    element.setAttribute('aria-expanded', isAberto);
    opcoes.setAttribute('aria-hidden', !isAberto);
  }

  // Ativa toggle no clique e no Enter para acessibilidade
  document.querySelectorAll('.filtro-titulo').forEach(titulo => {
    titulo.addEventListener('click', () => toggleFiltro(titulo));
    titulo.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        toggleFiltro(titulo);
      }
    });
  });
});
