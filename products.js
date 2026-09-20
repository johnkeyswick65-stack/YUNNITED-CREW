// ================= CATEGORIAS =================
const CATEGORIAS = [
  { id: 'world-library', nome: 'World Library', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h6a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H4z"/><path d="M20 4h-6a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h6z"/></svg>', desc: 'Livros digitais, escolares e e-books', link: 'world-library.html' },
  { id: 'acessorios', nome: 'Acessórios', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="3" width="10" height="8" rx="2"/><path d="M9 11v4a3 3 0 0 0 6 0v-4M12 18v3"/></svg>', desc: 'Electrónica, peças e materiais', link: 'acessorios.html' },
  { id: 'moda', nome: 'Moda', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3l3 3 3-3 6 4-3 5-3-2v11H9V10l-3 2-3-5z"/></svg>', desc: 'Roupas e acessórios de moda', link: 'moda.html' },
  { id: 'nhonga', nome: 'Nhonga', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l2-6h14l2 6M4 10v10h16V10M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg>', desc: 'Cadastre e venda os seus produtos', link: 'nhonga.html' }
];

// ================= PRODUTOS =================
const PRODUTOS = [
  // World Library
  { id: 1, nome: 'Livro Digital PDF', categoria: 'world-library', preco: 79.9, imagem: 'imagens/livro-digital-produto.jpg', desc: 'Qualquer género, entrega imediata.', icone: '📕', badge: 'Popular', popular: true },
  { id: 2, nome: 'Livro Escolar', categoria: 'world-library', preco: 19.9, imagem: 'imagens/livro-escolar-produto.jpg', desc: 'Material didáctico da 1ª à 12ª classe.', icone: '📘', badge: '', popular: true },
  { id: 3, nome: 'E-book', categoria: 'world-library', preco: 69.9, imagem: 'imagens/ebook-produto.jpg', desc: 'E-books exclusivos e best-sellers.', icone: '📖', badge: 'Novo', popular: false },
  { id: 4, nome: 'Pack 3 Livros Digitais', categoria: 'world-library', preco: 199.9, imagem: 'imagens/pack-livros-produto.jpg', desc: 'Escolha 3 títulos e poupe.', icone: '📚', badge: 'Promo', popular: true },

  // Acessórios
  { id: 5, nome: 'Cabo USB-C', categoria: 'acessorios', preco: 250, imagem: 'imagens/pexels-omer-yilmaz-13142647-6726749.jpg', desc: 'Cabo rápido e durável.', icone: '🔌', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="8" rx="2"/><path d="M9 11v4a3 3 0 0 0 6 0v-4"/><path d="M12 18v3"/></svg>', badge: '', popular: true },
  { id: 6, nome: 'Power Bank 10000mAh', categoria: 'acessorios', preco: 850, imagem: 'imagens/power-bank-produto.jpg', desc: 'Carregamento portátil.', icone: '🔋', badge: 'Popular', popular: true },
  { id: 7, nome: 'Fones Bluetooth', categoria: 'acessorios', preco: 1200, imagem: 'imagens/fones-bluetooth-produto.jpg', desc: 'Som de qualidade, sem fios.', icone: '🎧', badge: '', popular: false },
  { id: 8, nome: 'Carregador Rápido', categoria: 'acessorios', preco: 450, imagem: 'imagens/carregador-rapido-produto.jpg', desc: 'Carregamento turbo 20W.', icone: '⚡', badge: '', popular: false },

  // Moda
  { id: 9, nome: 'Camiseta Oversize', categoria: 'moda', preco: 550, imagem: 'imagens/camiseta-oversize-produto.jpg', desc: 'Algodão premium, vários tamanhos.', icone: '👕', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3l3 3 3-3 6 4-3 5-3-2v11H9V10l-3 2-3-5z"/></svg>', badge: 'Novo', popular: true },
  { id: 10, nome: 'Calça Jeans', categoria: 'moda', preco: 1200, imagem: 'imagens/calca-jeans-produto.jpg', desc: 'Corte moderno, unissexo.', icone: '👖', badge: '', popular: true },
  { id: 11, nome: 'Vestido Floral', categoria: 'moda', preco: 950, imagem: 'imagens/vestido-floral-produto.jpg', desc: 'Leve e elegante para o dia a dia.', icone: '👗', badge: '', popular: false },
  { id: 12, nome: 'Boné Snapback', categoria: 'moda', preco: 350, imagem: 'imagens/bone-snapback-produto.jpg', desc: 'Estilo urbano, ajustável.', icone: '🧢', badge: '', popular: false },

  // Nhonga
  { id: 13, nome: 'Cadastre o seu produto', categoria: 'nhonga', preco: 0, desc: 'Venda grátis na YUNNITED CREW.', icone: '🤝', svg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l2-6h14l2 6"/><path d="M4 10v10h16V10"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg>', badge: 'Grátis', popular: true },
  { id: 14, nome: 'Divulgue o seu negócio', categoria: 'nhonga', preco: 0, desc: 'Anuncie para todo o país.', icone: '📢', badge: 'Grátis', popular: true },
  { id: 15, nome: 'Torne-se vendedor', categoria: 'nhonga', preco: 0, desc: 'Fale connosco no WhatsApp.', icone: '💼', badge: 'Grátis', popular: false },
  { id: 16, nome: 'Suporte Nhonga', categoria: 'nhonga', preco: 0, desc: 'Ajudamos a cadastrar.', icone: '🆘', badge: '', popular: false }
];
