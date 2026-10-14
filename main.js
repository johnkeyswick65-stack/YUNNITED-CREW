
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

function gerarSkeletonHTML(quantidade) {
  const n = quantidade || 4;
  return Array.from({ length: n }, () => `
    <div class="skeleton-card">
      <div class="skeleton-card__media"></div>
      <div class="skeleton-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
        <div class="skeleton-card__footer">
          <div class="skeleton-line skeleton-line--price"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    </div>
  `).join('');
}


function mostrarSkeletons() {
  document.querySelectorAll('[data-row], #categoryGrid, #popularGrid, .cat-grid').forEach((grid) => {
    if (grid.querySelector('.skeleton-card')) return;
    if (grid.children.length > 0) return; // já tem conteúdo
    grid.innerHTML = gerarSkeletonHTML(4);
  });
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
  mostrarSkeletons();
  await carregarProdutosDaAPI();
  document.querySelectorAll('.skeleton-card').forEach((el) => el.remove());
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
        <button class="product-image-share" type="button" aria-label="Partilhar ${p.nome}" title="Partilhar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5"/>
          </svg>
        </button>
        <div class="product-share-menu" hidden>
          <button type="button" data-share="copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar link
          </button>
          <button type="button" data-share="whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m-3.6 4.2c.17 0 .34.01.48.01.16.01.36-.05.56.43.22.5.71 1.74.77 1.86.06.13.11.27.02.44-.08.16-.12.27-.25.41-.12.15-.26.33-.37.44-.12.12-.25.26-.11.51.15.25.65 1.07 1.4 1.73.96.86 1.77 1.12 2.02 1.25.25.12.39.1.54-.06.15-.17.63-.75.8-1 .17-.25.34-.21.57-.12.23.08 1.48.69 1.73.82.25.12.42.18.48.29.06.1.06.61-.15 1.21-.22.6-1.25 1.17-1.72 1.21-.47.05-.91.22-3.06-.63-2.59-1.01-4.22-3.64-4.35-3.8-.13-.17-1.03-1.36-1.03-2.6s.65-1.85.88-2.1c.23-.25.5-.31.67-.31"/></svg>
            WhatsApp
          </button>
          <button type="button" data-share="facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12"/></svg>
            Facebook
          </button>
        </div>
        
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
        <div class="product-image-modal__media">
          <img class="product-image-modal__image" src="" alt="">
          <button class="product-image-modal__close" type="button" aria-label="Fechar">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <div class="product-image-modal__info">
          <h3 class="product-image-modal__name"></h3>
          <p class="product-image-modal__desc"></p>
        </div>

        <div class="product-image-modal__bar">
          <button class="product-image-modal__like" type="button" aria-label="Curtir produto" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.8 8.7c0 5.5-8.8 10.4-8.8 10.4S3.2 14.2 3.2 8.7C3.2 5.8 5.1 4 7.7 4c1.7 0 3.1.9 4.3 2.3C13.2 4.9 14.6 4 16.3 4c2.6 0 4.5 1.8 4.5 4.7Z"/>
            </svg>
          </button>
          <button class="product-image-share product-image-share--modal" type="button" aria-label="Partilhar produto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5"/>
            </svg>
          </button>
          <div class="product-share-menu product-share-menu--modal" hidden>
            <button type="button" data-share="copy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copiar link
            </button>
            <button type="button" data-share="whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m-3.6 4.2c.17 0 .34.01.48.01.16.01.36-.05.56.43.22.5.71 1.74.77 1.86.06.13.11.27.02.44-.08.16-.12.27-.25.41-.12.15-.26.33-.37.44-.12.12-.25.26-.11.51.15.25.65 1.07 1.4 1.73.96.86 1.77 1.12 2.02 1.25.25.12.39.1.54-.06.15-.17.63-.75.8-1 .17-.25.34-.21.57-.12.23.08 1.48.69 1.73.82.25.12.42.18.48.29.06.1.06.61-.15 1.21-.22.6-1.25 1.17-1.72 1.21-.47.05-.91.22-3.06-.63-2.59-1.01-4.22-3.64-4.35-3.8-.13-.17-1.03-1.36-1.03-2.6s.65-1.85.88-2.1c.23-.25.5-.31.67-.31"/></svg>
              WhatsApp
            </button>
            <button type="button" data-share="facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12"/></svg>
              Facebook
            </button>
          </div>
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

function chipsDaCategoria(cat) {
  const mapa = {
    'world-library': ['Livro', 'Romance', 'Escolar', 'Marketing', 'Cultura', 'Psicologia'],
    'acessorios': ['iPhone', 'Samsung', 'USB', 'Fones', 'Carregador', 'Power Bank'],
    'moda': ['Chapéu', 'Camiseta', 'Calça', 'Vestido', 'Boné'],
    'nhonga': ['Vender', 'Divulgar', 'Suporte', 'Cadastro'],
  };
  return mapa[cat] || ['Livro', 'iPhone', 'Chapéu', 'Samsung', 'Marketing'];
}

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
    const catPagina = document.body.getAttribute('data-category') || '';
    let itens = catPagina ? PRODUTOS.filter(p => p.categoria === catPagina) : PRODUTOS;

    if (t) {
      const palavras = t.split(/\s+/).filter(Boolean);
      itens = (catPagina ? PRODUTOS.filter(p => p.categoria === catPagina) : PRODUTOS).filter(p => {
        const txt = normalizar(p.nome + ' ' + (p.desc || '') + ' ' + (p.categoria || ''));
        return palavras.every(pal => txt.includes(pal));
      });
    }

    if (!t) {
      resultsBox.innerHTML = `
        <p class="search-overlay__hint">Escreve para pesquisar entre ${itens.length} produtos.</p>
        <div class="search-overlay__chips">
          ${chipsDaCategoria(catPagina).map(c =>
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


/* ================= PARTILHA ================= */
document.addEventListener('click', (e) => {
  // Abrir/fechar o menu
  const shareBtn = e.target.closest('.product-image-share');
  if (shareBtn) {
    e.preventDefault();
    e.stopPropagation();
    const menu = shareBtn.parentElement.querySelector('.product-share-menu');
    const estavaAberto = menu && !menu.hidden;
    // Fechar todos os outros
    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));
    if (!estavaAberto && menu) {
      menu.hidden = false;
      shareBtn.classList.add('is-active');
    }
    return;
  }

  // Fechar se clicar fora
  if (!e.target.closest('.product-share-menu')) {
    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));
  }

  // Ações do menu
  const action = e.target.closest('[data-share]');
  if (action) {
    e.preventDefault();
    e.stopPropagation();
    const card = action.closest('.product-card');
    const img = card?.querySelector('.product-image-clickable');
    const nome = img?.dataset.name || card?.querySelector('.product-card__name')?.textContent || 'produto';
    const priceEl = card?.querySelector('.product-card__price')?.textContent || '';
    const url = 'https://yunnited-crew.pages.dev/?p=' + paraSlug(nome);
    const texto = `YUNNITED CREW — ${nome} (${priceEl}) \n${url}`;

    const tipo = action.dataset.share;
    if (tipo === 'copy') {
      const done = () => {
        action.classList.add('is-done');
        const original = action.innerHTML;
        action.innerHTML = '✓ Link copiado';
        setTimeout(() => { action.innerHTML = original; action.classList.remove('is-done'); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done).catch(() => {
          window.prompt('Copia o link:', url);
        });
      } else {
        window.prompt('Copia o link:', url);
      }
    } else if (tipo === 'whatsapp') {
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(texto), '_blank');
    } else if (tipo === 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank');
    }

    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));

    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));
  }
}, true);


/* ================= PARTILHA ================= */
document.addEventListener('click', (e) => {
  // Abrir/fechar o menu
  const shareBtn = e.target.closest('.product-image-share');
  if (shareBtn) {
    e.preventDefault();
    e.stopPropagation();
    const menu = shareBtn.parentElement.querySelector('.product-share-menu');
    const estavaAberto = menu && !menu.hidden;
    // Fechar todos os outros
    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));
    if (!estavaAberto && menu) {
      menu.hidden = false;
      shareBtn.classList.add('is-active');
    }
    return;
  }

  // Fechar se clicar fora
  if (!e.target.closest('.product-share-menu')) {
    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));
  }

  // Ações do menu
  const action = e.target.closest('[data-share]');
  if (action) {
    e.preventDefault();
    e.stopPropagation();
    const card = action.closest('.product-card');
    const img = card?.querySelector('.product-image-clickable');
    const nome = img?.dataset.name || card?.querySelector('.product-card__name')?.textContent || 'produto';
    const priceEl = card?.querySelector('.product-card__price')?.textContent || '';
    const url = 'https://yunnited-crew.pages.dev/?p=' + paraSlug(nome);
    const texto = `YUNNITED CREW — ${nome} (${priceEl}) \n${url}`;

    const tipo = action.dataset.share;
    if (tipo === 'copy') {
      const done = () => {
        action.classList.add('is-done');
        const original = action.innerHTML;
        action.innerHTML = '✓ Link copiado';
        setTimeout(() => { action.innerHTML = original; action.classList.remove('is-done'); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done).catch(() => {
          window.prompt('Copia o link:', url);
        });
      } else {
        window.prompt('Copia o link:', url);
      }
    } else if (tipo === 'whatsapp') {
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(texto), '_blank');
    } else if (tipo === 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank');
    }

    document.querySelectorAll('.product-share-menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.product-image-share.is-active').forEach(b => b.classList.remove('is-active'));
  }
});

/* ================= PRODUTO COMPARTILHADO ================= */
function abrirModalProdutoCompartilhado(p) {
  const modalExistente = document.getElementById('sharedProductModal');
  if (modalExistente) modalExistente.remove();

  const preco = p.preco === 0 ? 'Grátis' : p.preco.toFixed(2).replace('.', ',') + ' MT';
  const msg = encodeURIComponent('Olá YUNNITED CREW! Tenho interesse em: ' + p.nome + ' (' + preco + ').');
  const imagem = p.imagem
    ? '<img src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy">'
    : '<div class="shared-product__icon">' + (p.svg || p.icone || '') + '</div>';

  document.body.insertAdjacentHTML('beforeend', `
    <div id="sharedProductModal" class="shared-product" aria-hidden="false" role="dialog" aria-modal="true">
      <div class="shared-product__backdrop" data-close></div>
      <div class="shared-product__card">
        <button class="shared-product__close" type="button" data-close aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>

        <div class="shared-product__media">${imagem}</div>

        <div class="shared-product__body">
          <span class="shared-product__cat">${p.categoria}</span>
          <h2 class="shared-product__name">${p.nome}</h2>
          <p class="shared-product__desc">${p.desc || ''}</p>
          <div class="shared-product__price">${preco}</div>

          <div class="shared-product__actions">
            <a class="shared-product__buy" href="https://wa.me/258856178099?text=${msg}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m-3.6 4.2c.17 0 .34.01.48.01.16.01.36-.05.56.43.22.5.71 1.74.77 1.86.06.13.11.27.02.44-.08.16-.12.27-.25.41-.12.15-.26.33-.37.44-.12.12-.25.26-.11.51.15.25.65 1.07 1.4 1.73.96.86 1.77 1.12 2.02 1.25.25.12.39.1.54-.06.15-.17.63-.75.8-1 .17-.25.34-.21.57-.12.23.08 1.48.69 1.73.82.25.12.42.18.48.29.06.1.06.61-.15 1.21-.22.6-1.25 1.17-1.72 1.21-.47.05-.91.22-3.06-.63-2.59-1.01-4.22-3.64-4.35-3.8-.13-.17-1.03-1.36-1.03-2.6s.65-1.85.88-2.1c.23-.25.5-.31.67-.31"/></svg>
              Comprar no WhatsApp
            </a>
            <button type="button" class="shared-product__share" data-share-url="${location.origin + '/?p=' + paraSlug(p.nome)}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5"/></svg>
              Partilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  `);

  document.body.classList.add('modal-open');

  const modal = document.getElementById('sharedProductModal');
  modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      modal.remove();
      document.body.classList.remove('modal-open');
    });
  });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { modal.remove(); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onEsc); }
  });

  const shareBtn = modal.querySelector('.shared-product__share');
  shareBtn.addEventListener('click', async () => {
    const url = shareBtn.dataset.shareUrl;
    if (navigator.share) {
      try { await navigator.share({ title: p.nome, text: p.nome + ' — ' + preco, url }); return; } catch {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      shareBtn.textContent = '✓ Link copiado';
      setTimeout(() => shareBtn.innerHTML = 'Partilhar', 1600);
    } else {
      window.prompt('Copia:', url);
    }
  });
}

function iniciarProdutoCompartilhado() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('p') || params.get('produto');
  if (!slug) return;

  let tentativas = 20;
  const tentar = () => {
    const produto = PRODUTOS.find(x => paraSlug(x.nome) === slug);
    if (produto) return abrirModalProdutoCompartilhado(produto);
    if (tentativas-- > 0) return setTimeout(tentar, 150);
    console.warn('Produto não encontrado:', slug);
  };
  tentar();
}
document.addEventListener('DOMContentLoaded', iniciarProdutoCompartilhado);

/* ================= QUICK ACTIONS ================= */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.quick-btn');
  if (!btn) return;
  const tipo = btn.dataset.quick;

  if (tipo === 'share') {
    const data = {
      title: 'YUNNITED CREW',
      text: 'YUNNITED CREW — O maior mercado Branco de Moçambique',
      url: location.origin,
    };
    if (navigator.share) {
      navigator.share(data).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(location.origin).then(() => {
        btn.classList.add('is-done');
        const span = btn.querySelector('span');
        const orig = span.textContent;
        span.textContent = 'Copiado';
        setTimeout(() => { span.textContent = orig; btn.classList.remove('is-done'); }, 1500);
      });
    }
    return;
  }

  if (tipo === 'feedback') {
    const msg = encodeURIComponent('Olá YUNNITED CREW! Tenho um feedback sobre o site: ');
    window.open('https://wa.me/258856178099?text=' + msg, '_blank');
    return;
  }

  if (tipo === 'refresh') {
    btn.classList.add('is-done');
    const icon = btn.querySelector('i');
    if (icon) icon.style.animation = 'spin 0.6s linear infinite';
    setTimeout(() => location.reload(), 300);
    return;
  }

  if (tipo === 'brightness') {
    const box = document.querySelector('.mobile-menu__brightness');
    if (box) box.hidden = !box.hidden;
  }
});

// Slider de brilho
document.addEventListener('input', (e) => {
  if (e.target.id !== 'brightnessRange') return;
  const val = Number(e.target.value) / 100;
  // Aplicar filtro de brilho ao conteúdo (fora do menu, para o próprio menu não ficar afetado)
  document.documentElement.style.setProperty('--site-brightness', val);
  document.body.style.filter = 'brightness(' + val + ')';
  try { localStorage.setItem('yc_brightness', String(val)); } catch {}
});

// Restaurar brilho guardado
document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem('yc_brightness');
    if (saved) {
      const val = Number(saved);
      document.body.style.filter = 'brightness(' + val + ')';
      const r = document.getElementById('brightnessRange');
      if (r) r.value = String(Math.round(val * 100));
    }
  } catch {}
});

// Animação de spin para o refresh
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);

/* ================= VIEW TOGGLE (colunas / lista) ================= */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.view-btn');
  if (!btn) return;
  const modo = btn.dataset.view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('is-active', b === btn));
  if (modo === 'list') document.body.classList.add('view-list');
  else document.body.classList.remove('view-list');
  try { localStorage.setItem('yc_view', modo); } catch {}
});

document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem('yc_view') || 'grid';
    if (saved === 'list') {
      document.body.classList.add('view-list');
      document.querySelectorAll('.view-btn').forEach(b => {
        b.classList.toggle('is-active', b.dataset.view === 'list');
      });
    }
  } catch {}
});

/* ================= PLACEHOLDER ANIMADO (por categoria) ================= */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const FRASES = {
    'world-library': [
      'Pesquisar livros digitais...',
      'Pesquisar romances...',
      'Pesquisar e-books escolares...',
      'Pesquisar desenvolvimento pessoal...',
      'Pesquisar livros de cultura...',
      'Pesquisar psicologia...',
    ],
    'acessorios': [
      'Pesquisar iPhone...',
      'Pesquisar Samsung...',
      'Pesquisar cabos USB...',
      'Pesquisar fones bluetooth...',
      'Pesquisar carregadores...',
      'Pesquisar power banks...',
    ],
    'moda': [
      'Pesquisar camisetas...',
      'Pesquisar calças...',
      'Pesquisar chapéus...',
      'Pesquisar bonés...',
      'Pesquisar vestidos...',
      'Pesquisar peças de moda...',
    ],
    'nhonga': [
      'Pesquisar vendedores...',
      'Pesquisar negócios locais...',
      'Como divulgar o meu negócio?',
      'Como cadastrar produtos?',
    ],
    '_default': [
      'Pesquisar livros, acessórios, moda...',
      'Pesquisar livros digitais...',
      'Pesquisar romances...',
      'Pesquisar iPhone, Samsung...',
      'Pesquisar chapéus, bonés...',
      'Pesquisar e-books escolares...',
      'Pesquisar desenvolvimento pessoal...',
    ],
  };

  const cat = document.body.getAttribute('data-category') || '_default';
  const frases = FRASES[cat] || FRASES._default;

  let idx = 0, char = 0, apagando = false;
  const VELOCIDADE_ESCRITA = 60;
  const VELOCIDADE_APAGAR  = 25;
  const PAUSA_FIM          = 1800;
  const PAUSA_ENTRE        = 300;

  function tick() {
    const frase = frases[idx];
    if (!apagando) {
      char++;
      input.setAttribute('placeholder', frase.slice(0, char));
      if (char === frase.length) {
        apagando = true;
        return setTimeout(tick, PAUSA_FIM);
      }
      return setTimeout(tick, VELOCIDADE_ESCRITA);
    } else {
      char--;
      input.setAttribute('placeholder', frase.slice(0, char));
      if (char === 0) {
        apagando = false;
        idx = (idx + 1) % frases.length;
        return setTimeout(tick, PAUSA_ENTRE);
      }
      return setTimeout(tick, VELOCIDADE_APAGAR);
    }
  }

  // Pausa inicial
  setTimeout(tick, 900);
});

/* ================= CARROSSEL DE ANÚNCIOS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('adsStage');
  if (!stage) return;
  const slides = stage.querySelectorAll('.ads-slide');
  const dots = document.querySelectorAll('.ads-dot');
  if (slides.length < 2) return;

  let atual = 0;
  let timer = null;
  const INTERVALO = 5000;

  function mostrar(i) {
    slides.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
    atual = i;
  }

  function proximo() {
    mostrar((atual + 1) % slides.length);
  }

  function iniciar() {
    parar();
    timer = setInterval(proximo, INTERVALO);
  }

  function parar() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      mostrar(Number(d.dataset.target));
      iniciar(); // reinicia contagem após interação
    });
  });

  // Pausar quando o separador perde foco
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar();
    else iniciar();
  });

  iniciar();
});
