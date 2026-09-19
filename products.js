// ================= CATEGORIAS =================
const CATEGORIAS = [
  { id: 'world-library', nome: 'World Library', icone: '📚', desc: 'Livros digitais, escolares e e-books', link: 'world-library.html' },
  { id: 'acessorios', nome: 'Acessórios', icone: '🔌', desc: 'Electrónica, peças e materiais', link: 'acessorios.html' },
  { id: 'moda', nome: 'Moda', icone: '👕', desc: 'Roupas e acessórios de moda', link: 'moda.html' },
  { id: 'nhonga', nome: 'Nhonga', icone: '🤝', desc: 'Cadastre e venda os seus produtos', link: 'nhonga.html' }
];

// ================= PRODUTOS =================
const PRODUTOS = [
  // World Library
  { id: 1, nome: 'Livro Digital PDF', categoria: 'world-library', preco: 79.9, desc: 'Qualquer género, entrega imediata.', icone: '📕', badge: 'Popular', popular: true },
  { id: 2, nome: 'Livro Escolar', categoria: 'world-library', preco: 19.9, desc: 'Material didáctico da 1ª à 12ª classe.', icone: '📘', badge: '', popular: true },
  { id: 3, nome: 'E-book', categoria: 'world-library', preco: 69.9, desc: 'E-books exclusivos e best-sellers.', icone: '📖', badge: 'Novo', popular: false },
  { id: 4, nome: 'Pack 3 Livros Digitais', categoria: 'world-library', preco: 199.9, desc: 'Escolha 3 títulos e poupe.', icone: '📚', badge: 'Promo', popular: true },

  // Acessórios
  { id: 5, nome: 'Cabo USB-C', categoria: 'acessorios', preco: 250, desc: 'Cabo rápido e durável.', icone: '🔌', badge: '', popular: true },
  { id: 6, nome: 'Power Bank 10000mAh', categoria: 'acessorios', preco: 850, desc: 'Carregamento portátil.', icone: '🔋', badge: 'Popular', popular: true },
  { id: 7, nome: 'Fones Bluetooth', categoria: 'acessorios', preco: 1200, desc: 'Som de qualidade, sem fios.', icone: '🎧', badge: '', popular: false },
  { id: 8, nome: 'Carregador Rápido', categoria: 'acessorios', preco: 450, desc: 'Carregamento turbo 20W.', icone: '⚡', badge: '', popular: false },

  // Moda
  { id: 9, nome: 'Camiseta Oversize', categoria: 'moda', preco: 550, desc: 'Algodão premium, vários tamanhos.', icone: '👕', badge: 'Novo', popular: true },
  { id: 10, nome: 'Calça Jeans', categoria: 'moda', preco: 1200, desc: 'Corte moderno, unissexo.', icone: '👖', badge: '', popular: true },
  { id: 11, nome: 'Vestido Floral', categoria: 'moda', preco: 950, desc: 'Leve e elegante para o dia a dia.', icone: '👗', badge: '', popular: false },
  { id: 12, nome: 'Boné Snapback', categoria: 'moda', preco: 350, desc: 'Estilo urbano, ajustável.', icone: '🧢', badge: '', popular: false },

  // Nhonga
  { id: 13, nome: 'Cadastre o seu produto', categoria: 'nhonga', preco: 0, desc: 'Venda grátis na YUNNITED CREW.', icone: '🤝', badge: 'Grátis', popular: true },
  { id: 14, nome: 'Divulgue o seu negócio', categoria: 'nhonga', preco: 0, desc: 'Anuncie para todo o país.', icone: '📢', badge: 'Grátis', popular: true },
  { id: 15, nome: 'Torne-se vendedor', categoria: 'nhonga', preco: 0, desc: 'Fale connosco no WhatsApp.', icone: '💼', badge: 'Grátis', popular: false },
  { id: 16, nome: 'Suporte Nhonga', categoria: 'nhonga', preco: 0, desc: 'Ajudamos a cadastrar.', icone: '🆘', badge: '', popular: false }
];
