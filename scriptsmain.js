// ===== CONFIGURACIÓN DE USUARIOS =====
const USERS = {
  calidad: { password: 'dejahair', role: 'calidad', name: 'Auditor de Calidad' },
  operaciones: { password: 'Operaciones2026', role: 'operaciones', name: 'Gerente Operaciones' }
};

// ===== DATOS DE EJEMPLO =====
const sampleData = [
  { Ejecutivo: 'Juan Perez', 'Habilidad Comercial': 'SI', 'Tipo de Llamada': 'Venta' },
  { Ejecutivo: 'Maria Gomez', 'Habilidad Comercial': 'NO', 'Tipo de Llamada': 'No Venta' },
  { Ejecutivo: 'Luis Torres', 'Habilidad Comercial': 'SI', 'Tipo de Llamada': 'Venta' },
  { Ejecutivo: 'Ana Ruiz', 'Habilidad Comercial': 'SI', 'Tipo de Llamada': 'No Venta' },
  { Ejecutivo: 'Carlos Diaz', 'Habilidad Comercial': 'NO', 'Tipo de Llamada': 'Venta' },
];

// ===== VARIABLES GLOBALES =====
let currentUser = null;
let currentSection = 'dashboard';

// ===== FUNCIÓN LOGIN =====
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('loginError');
  
  if (USERS[username] && USERS[username].password === password) {
    currentUser = { username, ...USERS[username] };
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('loginForm').reset();
    errorDiv.textContent = '';
    showApp();
  } else {
    errorDiv.textContent = '❌ Usuario o contraseña incorrectos';
    errorDiv.style.display = 'block';
  }
  
  return false;
}

// ===== MOSTRAR APLICACIÓN =====
function showApp() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  document.getElementById('userRole').textContent = currentUser.name;
  setupMenuByRole();
  startDateTime();
  navigateTo('dashboard');
}

// ===== CONFIGURAR MENÚ SEGÚN ROL =====
function setupMenuByRole() {
  const role = currentUser.role;
  
  if (role === 'calidad') {
    document.getElementById('btnAuditorias').style.display = 'block';
    document.getElementById('btnEjecutivos').style.display = 'block';
    document.getElementById('btnReportes').style.display = 'block';
  } else if (role === 'operaciones') {
    document.getElementById('btnAuditorias').style.display = 'block';
    document.getElementById('btnReportes').style.display = 'block';
    document.getElementById('btnEjecutivos').style.display = 'none';
  }
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function navigateTo(section) {
  currentSection = section;
  
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.section === section) {
      btn.classList.add('active');
    }
  });
  
  const titles = {
    dashboard: '📊 Dashboard',
    auditorias: '✓ Auditorías',
    ejecutivos: '👥 Ejecutivos',
    reportes: '📄 Reportes'
  };
  document.getElementById('pageTitle').textContent = titles[section] || 'Página';
  
  const pageContent = document.getElementById('pageContent');
  
  switch(section) {
    case 'dashboard':
      pageContent.innerHTML = getDashboardContent();
      setTimeout(() => renderCharts(sampleData), 100);
      break;
    case 'auditorias':
      pageContent.innerHTML = getAuditoriasContent();
      renderTable(sampleData);
      break;
    case 'ejecutivos':
      pageContent.innerHTML = getEjecutivosContent();
      renderRanking(sampleData);
      break;
    case 'reportes':
      pageContent.innerHTML = getReportesContent();
      break;
  }
}

// ===== CONTENIDO DASHBOARD =====
function getDashboardContent() {
  return `
    <div class="dashboard-container">
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Calidad Promedio</h3>
          <p class="metric-value">85%</p>
        </div>
        <div class="metric-card">
          <h3>Auditorías Este Mes</h3>
          <p class="metric-value">24</p>
        </div>
        <div class="metric-card">
          <h3>Ejecutivos Evaluados</h3>
          <p class="metric-value">5</p>
        </div>
        <div class="metric-card">
          <h3>Tasa de Conformidad</h3>
          <p class="metric-value">92%</p>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-container">
          <h3>Habilidad Comercial</h3>
          <canvas id="chart1"></canvas>
        </div>
        <div class="chart-container">
          <h3>Tipo de Llamada</h3>
          <canvas id="chart2"></canvas>
        </div>
      </div>
    </div>
  `;
}

// ===== CONTENIDO AUDITORÍAS =====
function getAuditoriasContent() {
  return `
    <div class="auditorias-container">
      <div class="section-header">
        <h2>Gestión de Auditorías</h2>
        <button class="btn btn-primary" onclick="alert('Funcionalidad en desarrollo')">+ Nueva Auditoría</button>
      </div>
      
      <div class="search-bar">
        <input type="text" id="searchInput" class="search-input" placeholder="Buscar en auditorías...">
      </div>
      
      <div class="table-container">
        <table id="auditTable">
          <thead id="tableHead"></thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </div>
  `;
}

// ===== CONTENIDO EJECUTIVOS =====
function getEjecutivosContent() {
  return `
    <div class="ejecutivos-container">
      <div class="section-header">
        <h2>Ranking de Ejecutivos</h2>
        <button class="btn btn-primary" onclick="alert('Funcionalidad en desarrollo')">+ Nuevo Ejecutivo</button>
      </div>
      
      <div id="rankingSection"></div>
    </div>
  `;
}

// ===== CONTENIDO REPORTES =====
function getReportesContent() {
  return `
    <div class="reportes-container">
      <div class="section-header">
        <h2>Reportes y Análisis</h2>
        <button class="btn btn-primary" onclick="alert('Funcionalidad en desarrollo')">📥 Descargar</button>
      </div>
      
      <div class="reportes-grid">
        <div class="reporte-card">
          <h3>Reporte Mensual</h3>
          <p>Análisis completo del mes</p>
          <button class="btn btn-secondary">Ver</button>
        </div>
        <div class="reporte-card">
          <h3>Por Ejecutivo</h3>
          <p>Desempeño individual</p>
          <button class="btn btn-secondary">Ver</button>
        </div>
        <div class="reporte-card">
          <h3>Por Criterio</h3>
          <p>Análisis de criterios</p>
          <button class="btn btn-secondary">Ver</button>
        </div>
        <div class="reporte-card">
          <h3>Tendencias</h3>
          <p>Proyecciones futuras</p>
          <button class="btn btn-secondary">Ver</button>
        </div>
      </div>
    </div>
  `;
}

// ===== CERRAR SESIÓN =====
function logout() {
  if (confirm('¿Está seguro de que desea cerrar sesión?')) {
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = '';
  }
}

// ===== FECHA Y HORA =====
function startDateTime() {
  const dateTimeEl = document.getElementById('dateTime');
  
  function update() {
    const now = new Date();
    dateTimeEl.textContent = now.toLocaleString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  update();
  setInterval(update, 1000);
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
  const savedUser = sessionStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showApp();
  }
});
