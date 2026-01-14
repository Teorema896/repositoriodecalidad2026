// ===== Usuarios y datos de prueba =====
const users = {
  calidad: { password: 'dejahair', role: 'calidad' },
  operaciones: { password: 'Operaciones2026', role: 'operaciones' }
};

const sampleData = [
  { Ejecutivo: 'Juan Perez', 'Habilidad Comercial': 'SI', 'Tipo de Llamada': 'Venta' },
  { Ejecutivo: 'Maria Gomez', 'Habilidad Comercial': 'NO', 'Tipo de Llamada': 'No Venta' },
  { Ejecutivo: 'Luis Torres', 'Habilidad Comercial': 'SI', 'Tipo de Llamada': 'Venta' },
  { Ejecutivo: 'Ana Ruiz', 'Habilidad Comercial': 'SI', 'Tipo de Llamada': 'No Venta' },
  { Ejecutivo: 'Carlos Diaz', 'Habilidad Comercial': 'NO', 'Tipo de Llamada': 'Venta' },
];

let currentUser = null;

// ===== Login =====
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('loginError');

  if(users[username] && users[username].password === password){
    currentUser = users[username];
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    setupUIByRole(currentUser.role);
    renderTable(sampleData);
    renderRanking(sampleData);
    renderCharts(sampleData);
    startDateTime();
  } else {
    errorDiv.textContent = 'Usuario o contraseña incorrectos';
  }
}

// ===== Mostrar botones según rol =====
function setupUIByRole(role){
  if(role==='calidad'){
    document.getElementById('btnDashboard').classList.add('hidden');
    document.getElementById('btnRanking').classList.add('hidden');
    document.getElementById('btnGestionCalidad').classList.remove('hidden');
  } else if(role==='operaciones'){
    document.getElementById('btnDashboard').classList.remove('hidden');
    document.getElementById('btnRanking').classList.remove('hidden');
    document.getElementById('btnGestionCalidad').classList.add('hidden');
  }
}

// ===== Fecha y hora =====
function startDateTime(){
  const dateTimeEl = document.getElementById('dateTime');
  function update(){
    const now = new Date();
    dateTimeEl.textContent = now.toLocaleString('es-PE',{weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'});
  }
  update();
  setInterval(update,1000);
}

// ===== Buscar en tabla =====
document.getElementById('searchInput').addEventListener('input', function(){
  const query = this.value.toLowerCase();
  const filtered = sampleData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(query)));
  renderTable(filtered);
});

// ===== Botones de navegación =====
document.getElementById('btnDashboard').addEventListener('click',()=>{
  document.getElementById('tableSection').classList.remove('hidden');
  document.getElementById('rankingSection').classList.add('hidden');
});
document.getElementById('btnRanking').addEventListener('click',()=>{
  document.getElementById('tableSection').classList.add('hidden');
  document.getElementById('rankingSection').classList.remove('hidden');
});
document.getElementById('btnGestionCalidad').addEventListener('click',()=>{
  document.getElementById('tableSection').classList.remove('hidden');
  document.getElementById('rankingSection').classList.add('hidden');
});
