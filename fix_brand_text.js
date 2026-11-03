const fs = require('fs');
const F = 'style.css';
let s = fs.readFileSync(F, 'utf8');

// A regra de correção: Força a descrição a aparecer, mas pequena
const cssFix = `

/* ============================================================
   YU BOT FIX: MOSTRAR A DESCRIÇÃO NO CABEÇALHO
   ============================================================ */
.brand__text small {
  display: block !important; /* Cancela o "display: none" */
  font-size: 10px !important; /* Letra pequena para caber no telemóvel */
  line-height: 1.2 !important;
  color: #a5a5ad !important;
  margin-top: 2px !important;
  white-space: nowrap !important; /* Impede que o texto quebre para a linha de baixo */
}
`;

fs.appendFileSync(F, cssFix);
console.log('✅ Descrição do cabeçalho restaurada!');
