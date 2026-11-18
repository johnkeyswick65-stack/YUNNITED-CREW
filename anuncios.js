/* ===== NHONGA | RECRUTAMENTO DE AFILIADOS ===== */
(() => {
  'use strict';

  const pagina = location.pathname.replace(/\/+$/, '');
  if (pagina !== '' && pagina !== '/index.html') return;

  const CHAVE = 'yc_nhonga_afiliados_v1';

  try {
    if (sessionStorage.getItem(CHAVE)) return;
  } catch (_) {}

  const mensagem =
    'Olá YUNNITED CREW! Tenho interesse em afiliar-me à Nhonga e adicionar os meus produtos à plataforma. Gostaria de receber mais informações.';

  const whatsapp =
    'https://wa.me/258856178099?text=' + encodeURIComponent(mensagem);

  const overlay = document.createElement('div');
  overlay.className = 'yc-anuncio-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Afiliação Nhonga');

  overlay.innerHTML = `
    <section class="yc-anuncio">

      <svg class="yc-anuncio-onda"
           viewBox="0 0 400 400"
           preserveAspectRatio="none"
           aria-hidden="true">
        <path d="M0 0 H400 V0
          C300 105 150 190 0 235 Z"
          fill="#7135ad"/>
        <path d="M400 0
          C300 105 150 190 0 235"
          fill="none"
          stroke="#a77bd0"
          stroke-width="2.5"/>

        <g class="yc-anuncio-bolhas">
          <circle cx="30" cy="22" r="25"/>
          <circle cx="90" cy="12" r="13"/>
          <circle cx="105" cy="65" r="23"/>
          <circle cx="15" cy="83" r="10"/>
          <circle cx="65" cy="95" r="7"/>
        </g>
      </svg>

      <button class="yc-anuncio-fechar"
              type="button"
              aria-label="Fechar anúncio">×</button>

      <div class="yc-anuncio-topo">
        <div class="yc-anuncio-marca">YUNNITED CREW APRESENTA</div>
        <h2 class="yc-anuncio-titulo">NHONGA</h2>
      </div>

      <svg class="yc-anuncio-carrinho um"
           viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <circle cx="9" cy="20" r="1.5"/>
        <circle cx="18" cy="20" r="1.5"/>
        <path d="M2 3h2l3 13h12l3-9H6"/>
        <path d="M8 10h11M9 13h9"/>
      </svg>

      <svg class="yc-anuncio-carrinho dois"
           viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <circle cx="9" cy="20" r="1.5"/>
        <circle cx="18" cy="20" r="1.5"/>
        <path d="M2 3h2l3 13h12l3-9H6"/>
      </svg>

      <div class="yc-anuncio-conteudo">
        <p class="yc-anuncio-descricao">
          Estamos a receber novos afiliados! Adicione os seus produtos
          físicos e digitais à Yunnited Crew e divulgue-os através
          da nossa plataforma.
        </p>

        <div class="yc-anuncio-destaque">
          Faça parte da nossa rede de vendedores.
        </div>

        <div class="yc-anuncio-icones" aria-hidden="true">

          <!-- Marketplace -->
          <span class="yc-anuncio-icone">
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10l2-6h14l2 6"/>
              <path d="M4 10v10h16V10"/>
              <path d="M3 10a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/>
              <path d="M9 20v-5h6v5"/>
            </svg>
          </span>

          <!-- Megafone -->
          <span class="yc-anuncio-icone">
            <svg viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 11v2a2 2 0 002 2h2l10 5V4L7 9H5a2 2 0 00-2 2z"/>
              <path d="M7 15l2 6h4l-2-4"/>
              <path d="M20 9l2-2M20 15l2 2"/>
            </svg>
          </span>

        </div>
      </div>

      <div class="yc-anuncio-acoes">
        <a class="yc-anuncio-afiliar"
           href="${whatsapp}"
           target="_blank"
           rel="noopener">Afiliar-se</a>
      </div>

    </section>
  `;

  document.body.appendChild(overlay);

  function fechar() {
    overlay.classList.remove('aberto');
    overlay.remove();

    try {
      sessionStorage.setItem(CHAVE, '1');
    } catch (_) {}
  }

  overlay.querySelector('.yc-anuncio-fechar')
    .addEventListener('click', fechar);

  overlay.addEventListener('click', evento => {
    if (evento.target === overlay) fechar();
  });

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' &&
        overlay.classList.contains('aberto')) {
      fechar();
    }
  });

  setTimeout(() => {
    try {
      sessionStorage.setItem(CHAVE, '1');
    } catch (_) {}

    overlay.classList.add('aberto');
  }, 700);
})();
