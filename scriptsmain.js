// scripts/main.js
import { showMessage, formatDate, clearElement } from './utils.js';
import { renderTable } from './table.js';
import { renderCharts } from './charts.js';

// Usuarios de prueba
const users = [
  { usuario: 'calidad', password: 'dejahair', role: 'calidad' },
  { usuario: 'operaciones', password: 'Operaciones 2026', role: 'operaciones' }
];

// Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const usuario = formData.get('usuario');
  const password = formData.get('password');

  const user = users.find(u => u.usuario === usuario && u.password === password);

  if (!user) {
    showMessage('Usuario o contraseña incorrectos', 'error');
    return;
  }

  // Ocultar login y mostrar app
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('appContainer').style.display = 'block';

  // Render menú según rol
  renderMenu(user.role);

  // Cargar dashboard de prueba
  initDashboard();
});

function renderMenu(role) {
  const menu = document.getElementById('menuButtons');
  menu.innerHTML = '';
  if (role === 'calidad') {
    menu.innerHTML = `<button class="btn btn-primary" onclick="alert('Gestión Calidad')">Gestión Calidad</button>`;
  }
  if (role === 'operaciones') {
    menu.innerHTML = `
      <button class="btn btn-primary" onclick="alert('Dashboard')">Dashboard</button>
      <button class="btn btn-secondary" onclick="alert('Ranking')">Ranking</button>
    `;
  }
}

// Inicialización dashboard con datos de prueba
function initDashboard() {
  // Datos de prueba
  const sampleData = [
    { Ejecutivo: 'Juan', Supervisor: 'Ivan', Campaña: 'Deepening', 'Tipo de Llamada': 'Venta', 'Habilidad comercial': 'SI', 'Motivo No Venta': 'N/A', Responsabilidad: 'N/A', fechaHora: formatDate(new Date()) },
    { Ejecutivo: 'Maria', Supervisor: 'Ronny', Campaña: 'Préstamos', 'Tipo de Llamada': 'No Venta', 'Habilidad comercial': 'NO', 'Motivo No Venta': 'Cliente sin deudas', Responsabilidad: 'Cliente', fechaHora: formatDate(new Date()) }
  ];

  // Render tabla y gráficos
  renderTable(sampleData);
  renderCharts(sampleData);
}

// Exponer funciones al scope global para botones de ejemplo
window.renderTable = renderTable;
window.renderCharts = renderCharts;
