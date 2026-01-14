// ========== main.js ==========
// VARIABLES GLOBALES - USAR window. para hacerlas globales
window.allData = [];
window.filteredData = [];
window.chartInstances = [];

// CONSTANTES - también globales
window.GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTR4TBW_qQtsV-yHeyv_EJhixz5qW1AFxXyWLZYxEa95MrUWiqrLrpJuVdFAPmtFKUnvtQ1mO0muhNq/pub?gid=0&single=true&output=csv';

// FUNCIONES GLOBALES
window.switchTab = function(tabName) {
    console.log('Cambiando a:', tabName);
    
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar seleccionada
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Actualizar botones sidebar
    document.querySelectorAll('.sidebar-link').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    // Ejecutar funciones específicas
    if (tabName === 'dashboard' && typeof loadDataFromGoogleSheets === 'function') {
        setTimeout(loadDataFromGoogleSheets, 100);
    }
    
    if (tabName === 'feedback' && typeof initFeedback === 'function') {
        setTimeout(initFeedback, 100);
    }
    
    if (tabName === 'analisis' && typeof renderAnalysis === 'function') {
        setTimeout(renderAnalysis, 100);
    }
};

window.closeModal = function() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'none';
};

window.showMessage = function(text, type) {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    container.innerHTML = `<div class="message message-${type}">${text}</div>`;
    setTimeout(() => { container.innerHTML = ''; }, 4000);
};

// Función placeholder hasta que se cargue dashboard.js
window.loadDataFromGoogleSheets = function() {
    console.log('⚠️ dashboard.js no cargado aún');
    const loading = document.getElementById('loadingMessage');
    if (loading) {
        loading.innerHTML = '🔄 Cargando módulo de datos...';
    }
};

window.mostrarRanking = function() {
    alert('Función de ranking - En desarrollo');
};

window.clearFilters = function() {
    alert('Función clearFilters - En desarrollo');
};

window.exportToCSV = function() {
    alert('Función exportToCSV - En desarrollo');
};

// Reloj
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

    const fechaEl = document.getElementById('fechaActual');
    const horaEl = document.getElementById('horaActual');
    
    if (fechaEl) fechaEl.textContent = fechaFormateada;
    if (horaEl) horaEl.textContent = `${horas}:${minutos}:${segundos}`;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main.js inicializado');
    
    // Iniciar reloj
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Asegurar que funciones existan
    if (typeof handleLogin === 'undefined') {
        console.warn('⚠️ login.js no cargado aún');
    }
});
