// Variables globales
let allData = [];
let filteredData = [];
let currentEjecutivo = '';
let currentCampana = '';
let chartInstances = [];

// Constantes
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTR4TBW_qQtsV-yHeyv_EJhixz5qW1AFxXyWLZYxEa95MrUWiqrLrpJuVdFAPmtFKUnvtQ1mO0muhNq/pub?gid=0&single=true&output=csv';
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcYSCuNukl4XLzGDhG5iAvmuvcAZjuD7IYSglifnGa2HSdx3GY3aBI_Gwx5o16XEa6og/exec';

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    let fechaFormateada = ahora.toLocaleDateString('es-PE', opciones);
    fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = `${horas}:${minutos}:${segundos}`;
}

// Cambiar entre pestañas
function switchTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Actualizar botones activos en sidebar
    document.querySelectorAll('.sidebar-link').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    // Cargar datos si es necesario
    if (tabName === 'dashboard') {
        loadDataFromGoogleSheets();
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar reloj
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar datos iniciales si estamos en dashboard
    if (document.querySelector('.tab-content.active').id === 'dashboard') {
        loadDataFromGoogleSheets();
    }
});
