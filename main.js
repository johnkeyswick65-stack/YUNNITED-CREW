document.addEventListener('DOMContentLoaded', () => {
  // Ano no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Renderizar categorias na página inicial
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (categoriesGrid) {
    categoriesGrid.innerHTML = CATEGORIAS.map(cat => `
      <a class="cat-card" href="${cat.link}">
        <span class="cat-card__icon">${cat.icone}</span>
        <h3>${cat.nome}</h3>
        <p>${cat.desc}</p>
        <span class="cat-card__link">Explorar →</span>
      </a>
    `).join('');
  }

  // Renderizar produtos populares
  const popularGrid = document.getElementById('popularGrid');
  if (popularGrid) {
    const populares = PRODUTOS.filter(p => p.popular).slice(0, 8);
    popularGrid.innerHTML = populares.map(p => criarCardProduto(p)).join('');
  }

  // Renderizar linhas por categoria na página inicial
  document.querySelectorAll('[data-row]').forEach(grid => {
    const cat = grid.getAttribute('data-row');
    const itens = PRODUTOS.filter(p => p.categoria === cat).slice(0, 4);
    grid.innerHTML = itens.map(p => criarCardProduto(p)).join('');
  });

  // Página de categoria individual
  const categoryGrid = document.getElementById('categoryGrid');
  if (categoryGrid) {
    const cat = document.body.getAttribute('data-category');
    const itens = PRODUTOS.filter(p => p.categoria === cat);
    categoryGrid.innerHTML = itens.map(p => criarCardProduto(p)).join('');
  }

  // Busca simples
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const nome = card.querySelector('.product-card__name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.product-card__desc')?.textContent.toLowerCase() || '';
        if (nome.includes(termo) || desc.includes(termo)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});

function criarCardProduto(p) {
  const preco = p.preco === 0 ? 'Grátis' : `${p.preco.toFixed(2).replace('.', ',')} MT`;
  const badge = p.badge ? `<span class="product-card__badge">${p.badge}</span>` : '';
  const msg = encodeURIComponent(`Olá YUNNITED CREW! Tenho interesse em: ${p.nome} (${preco}).`);
  return `
    <article class="product-card">
      ${badge}
      <div class="product-card__icon">${p.icone}</div>
      <h3 class="product-card__name">${p.nome}</h3>
      <p class="product-card__desc">${p.desc}</p>
      <div class="product-card__footer">
        <span class="product-card__price">${preco}</span>
        <a class="btn btn--wa btn--sm" href="https://wa.me/258856178099?text=${msg}" target="_blank" rel="noopener">Comprar</a>
      </div>
    </article>
  `;
}
