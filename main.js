
const CATEGORIA_SLUG = {
  'World Library': 'world-library',
  'Acessórios': 'acessorios',
  'Moda': 'moda',
  'Nhonga': 'nhonga',
};
function paraSlug(nome) {
  if (!nome) return '';
  return CATEGORIA_SLUG[nome] || nome
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function carregarProdutosDaAPI() {
  try {
    const response = await fetch('https://yunnited-crew-backend.pages.dev/api/products');

    if (!response.ok) {
      throw new Error('Erro ao carregar produtos');
    }

    const data = await response.json();
    console.log('PRODUTOS DO RENDER:', data.items);

    if (!data.success || !Array.isArray(data.items)) {
      return;
    }

    const produtosAPI = data.items.map(p => ({
      id: p._id || p.id,
      nome: p.name,
      categoria: paraSlug(p.category),
      preco: Number(p.price) || 0,
      desc: p.description || '',
      imagem: p.image ? (p.image.startsWith("http") ? p.image : "https://yunnited-crew-backend.onrender.com" + p.image) : (p.imagem || ""), 
      popular: Boolean(p.popular),
      badge: p.badge || '',
      icone: p.icone || '',
      svg: p.svg || ''
    }));

    const idsAPI = new Set(produtosAPI.map(p => String(p.id)));

    const produtosLocais = PRODUTOS.filter(
      p => !idsAPI.has(String(p.id))
    );

    PRODUTOS.length = 0;
    PRODUTOS.push(...produtosLocais, ...produtosAPI);

  } catch (error) {
    console.error('Erro ao carregar produtos da API:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarProdutosDaAPI();
  // Ano no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Renderizar produtos populares
  const popularGrid = document.getElementById('popularGrid');
  if (popularGrid) {
    const marcadosPopulares = PRODUTOS.filter(p => p.popular);
    const populares = (marcadosPopulares.length ? marcadosPopulares : PRODUTOS).slice(0, 8);
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

  
});

function criarCardProduto(p) {
  const preco = p.preco === 0 ? 'Grátis' : `${p.preco.toFixed(2).replace('.', ',')} MT`;
  const badge = p.badge ? `<span class="product-card__badge">${p.badge}</span>` : '';
  const msg = encodeURIComponent(`Olá YUNNITED CREW! Tenho interesse em: ${p.nome} (${preco}).`);

  const nomeCurto = String(p.nome || '').slice(0, 35);
  const descCurta = String(p.desc || '').slice(0, 90);

  const visual = p.imagem
    ? `<div class="product-card__image product-image-clickable"
          data-image="${p.imagem}"
          data-name="${nomeCurto.replace(/"/g, '&quot;')}"
          data-desc="${descCurta.replace(/"/g, '&quot;')}"
          role="button"
          tabindex="0"
          aria-label="Ampliar imagem de ${p.nome}">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">

        ${p.categoria !== 'nhonga' ? `
        <button
          class="product-image-like"
          type="button"
          aria-label="Curtir ${p.nome}"
          aria-pressed="false"
          title="Curtir"
          onclick="e.stopPropagation()">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 8.7c0 5.5-8.8 10.4-8.8 10.4S3.2 14.2 3.2 8.7C3.2 5.8 5.1 4 7.7 4c1.7 0 3.1.9 4.3 2.3C13.2 4.9 14.6 4 16.3 4c2.6 0 4.5 1.8 4.5 4.7Z"/>
          </svg>
        </button>
        ` : ''}
      </div>`
    : `<div class="product-card__icon">${p.svg || p.icone}</div>`;

  return `
    <article class="product-card">
      ${badge}
      ${visual}

      <h3 class="product-card__name">${p.nome}</h3>
      <p class="product-card__desc">${p.desc}</p>

      <div class="product-card__footer">
        <span class="product-card__price">${preco}</span>

        <a class="btn btn--wa btn--sm"
           href="https://wa.me/258856178099?text=${msg}"
           target="_blank"
           rel="noopener">
          Comprar
        </a>
      </div>
    </article>
  `;
}

function iniciarModalProdutos() {
  if (document.getElementById('productImageModal')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div id="productImageModal" class="product-image-modal" aria-hidden="true">
      <div class="product-image-modal__backdrop"></div>

      <div class="product-image-modal__content" role="dialog" aria-modal="true">
        <button class="product-image-modal__close" type="button" aria-label="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>

        <img class="product-image-modal__image" src="" alt="">

        <div class="product-image-modal__info">
          <div class="product-image-modal__text">
            <h3 class="product-image-modal__name"></h3>
            <p class="product-image-modal__desc"></p>
          </div>

          <button class="product-image-modal__like" type="button" aria-label="Curtir produto" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 8.7c0 5.5-8.8 10.4-8.8 10.4S3.2 14.2 3.2 8.7C3.2 5.8 5.1 4 7.7 4c1.7 0 3.1.9 4.3 2.3C13.2 4.9 14.6 4 16.3 4c2.6 0 4.5 1.8 4.5 4.7Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `);

  const modal = document.getElementById('productImageModal');
  const modalImage = modal.querySelector('.product-image-modal__image');
  const modalName = modal.querySelector('.product-image-modal__name');
  const modalDesc = modal.querySelector('.product-image-modal__desc');
  const close = modal.querySelector('.product-image-modal__close');
  const backdrop = modal.querySelector('.product-image-modal__backdrop');
  const modalLike = modal.querySelector('.product-image-modal__like');

  function fecharModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function abrirModal(el) {
    modalImage.src = el.dataset.image;
    modalImage.alt = el.dataset.name || 'Imagem do produto';
    modalName.textContent = el.dataset.name || '';
    modalDesc.textContent = el.dataset.desc || '';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  document.addEventListener('click', (e) => {
    const externalLike = e.target.closest('.product-image-like');

    if (externalLike) {
      e.preventDefault();
      e.stopPropagation();

      const ativo = externalLike.getAttribute('aria-pressed') === 'true';
      const novoEstado = !ativo;

      externalLike.setAttribute('aria-pressed', String(novoEstado));
      externalLike.classList.toggle('is-liked', novoEstado);
      return;
    }

    const image = e.target.closest('.product-image-clickable');
    if (image) abrirModal(image);

    if (e.target.closest('.product-image-modal__like')) {
      const ativo = modalLike.getAttribute('aria-pressed') === 'true';
      modalLike.setAttribute('aria-pressed', String(!ativo));
      modalLike.classList.toggle('is-liked', !ativo);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();

    const image = e.target.closest?.('.product-image-clickable');
    if (image && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      abrirModal(image);
    }
  });

  close.addEventListener('click', fecharModal);
  backdrop.addEventListener('click', fecharModal);
}

document.addEventListener('DOMContentLoaded', iniciarModalProdutos);


/* ================= MENU MOBILE ================= */

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const siteMenu = document.getElementById('siteMenu');

  if (!menuToggle || !siteMenu) return;

  menuToggle.addEventListener('click', () => {
    const aberto = siteMenu.classList.toggle('menu-open');

    menuToggle.classList.toggle('is-open', aberto);
    menuToggle.setAttribute('aria-expanded', String(aberto));
    siteMenu.setAttribute('aria-hidden', String(!aberto));
  });

  siteMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteMenu.classList.remove('menu-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      siteMenu.setAttribute('aria-hidden', 'true');
    });
  });
});

/* ================= SEARCH OVERLAY ================= */
function iniciarSearchOverlay() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput || document.getElementById('searchOverlay')) return;

  // Impede o teclado nativo no input do header
  searchInput.setAttribute('readonly', 'readonly');
  searchInput.setAttribute('inputmode', 'none');

  document.body.insertAdjacentHTML('beforeend', `
    <div id="searchOverlay" class="search-overlay" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="search-overlay__inner">
        <div class="search-overlay__head">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input id="searchOverlayInput" type="search" placeholder="Pesquisar produtos..." aria-label="Pesquisar produtos" autocomplete="off">
          <button type="button" class="search-overlay__close" aria-label="Fechar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="search-overlay__body" id="searchOverlayResults"></div>
      </div>
    </div>
  `);

  const overlay = document.getElementById('searchOverlay');
  const overlayInput = document.getElementById('searchOverlayInput');
  const resultsBox = document.getElementById('searchOverlayResults');

  function abrir() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-open');
    overlayInput.value = '';
    renderResultados('');
    setTimeout(() => overlayInput.focus(), 80);
  }

  function fechar() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-open');
    overlayInput.blur();
  }

  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function renderResultados(termo) {
    const t = normalizar(termo).trim();
    let itens = PRODUTOS;

    if (t) {
      const palavras = t.split(/\s+/).filter(Boolean);
      itens = PRODUTOS.filter(p => {
        const txt = normalizar(p.nome + ' ' + (p.desc || '') + ' ' + (p.categoria || ''));
        return palavras.every(pal => txt.includes(pal));
      });
    }

    if (!t) {
      resultsBox.innerHTML = `
        <p class="search-overlay__hint">Escreve para pesquisar entre ${PRODUTOS.length} produtos.</p>
        <div class="search-overlay__chips">
          ${['Livro','Romance','Escolar','iPhone','Samsung','Chapéu','Marketing'].map(c =>
            '<button type="button" class="search-chip" data-chip="' + c + '">' + c + '</button>'
          ).join('')}
        </div>
      `;
      resultsBox.querySelectorAll('.search-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          overlayInput.value = chip.dataset.chip;
          renderResultados(chip.dataset.chip);
        });
      });
      return;
    }

    if (!itens.length) {
      resultsBox.innerHTML = '<p class="search-overlay__hint">Nenhum produto encontrado para "' + termo + '".</p>';
      return;
    }

    const limitado = itens.slice(0, 30);
    resultsBox.innerHTML = `
      <p class="search-overlay__count">${itens.length} resultado(s)</p>
      <div class="search-results">
        ${limitado.map(p => {
          const preco = p.preco === 0 ? 'Grátis' : p.preco.toFixed(2).replace('.', ',') + ' MT';
          const img = p.imagem
            ? '<img src="' + p.imagem + '" alt="" loading="lazy">'
            : '<div class="search-result__icon">' + (p.svg || p.icone || '') + '</div>';
          return `
            <a class="search-result" href="${p.categoria}.html">
              <div class="search-result__media">${img}</div>
              <div class="search-result__body">
                <div class="search-result__name">${p.nome}</div>
                <div class="search-result__desc">${(p.desc || '').slice(0, 70)}</div>
                <div class="search-result__meta">
                  <span class="search-result__cat">${p.categoria}</span>
                  <span class="search-result__price">${preco}</span>
                </div>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    `;
  }

  searchInput.addEventListener('click', (e) => { e.preventDefault(); abrir(); });
  searchInput.addEventListener('focus', (e) => { e.target.blur(); abrir(); });

  overlayInput.addEventListener('input', (e) => renderResultados(e.target.value));
  overlay.querySelector('.search-overlay__close').addEventListener('click', fechar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) fechar();
  });
}
document.addEventListener('DOMContentLoaded', iniciarSearchOverlay);
