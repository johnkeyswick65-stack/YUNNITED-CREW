const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db'); // Ajuste se o seu ficheiro de config for diferente

const app = express();

// --- 1. SEGURANÇA: HELMET (Cabeçalhos de Segurança) ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'https://res.cloudinary.com/'],
      connectSrc: ["'self'", 'https://yunnited-crew.pages.dev', 'https://api.yourdomain.com'] // Ajuste para o seu domínio de API
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true
}));

// --- 2. SEGURANÇA: CORS (Restrição de Origem) ---
const allowedOrigins = ['https://yunnited-crew.pages.dev', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- 3. SEGURANÇA: RATE LIMITING GLOBAL ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: { error: 'Muitas requisições deste IP. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health'
});

app.use('/api', globalLimiter);

// --- 4. SEGURANÇA: MONGO SANITIZE (Prevenção de NoSQL Injection) ---
app.use(mongoSanitize());

// --- 5. PARSERS E MIDDLEWARES ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// --- 6. RATE LIMITING ESPECÍFICO PARA LOGIN ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' }
});

// --- 7. EXEMPLO DE ROTA DE LOGIN ---
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Credenciais obrigatórias' });
  }

  // Lógica de autenticação (bcrypt, etc.)
  // Exemplo simplificado:
  // const user = await User.findOne({ username });
  // if (!user || !(await bcrypt.compare(password, user.password))) {
  //   return res.status(401).json({ error: 'Credenciais inválidas' });
  // }

  const token = jwt.sign({ id: 'user-id', role: 'admin' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 3600 * 1000
  };

  res.cookie('jwt', token, cookieOptions);
  res.json({ message: 'Login bem-sucedido', token });
});

// --- 8. EXEMPLO DE ROTA PROTEGIDA ---
const auth = (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

app.get('/api/admin/dashboard', auth, (req, res) => {
  res.json({ message: 'Dashboard carregado com segurança', user: req.user });
});

// --- 9. MIDDLEWARE DE ERROS ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// --- 10. INICIALIZAÇÃO ---
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados:', err);
  process.exit(1);
});
