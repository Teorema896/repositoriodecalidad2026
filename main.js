// ========== main.js ==========
// VARIABLES GLOBALES - USAR window. para hacerlas globales
window.allData = [];
window.filteredData = [];
window.chartInstances = [];

// CONSTANTES - también globales
window.GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTR4TBW_qQtsV-yHeyv_EJhixz5qW1AFxXyWLZYxEa95MrUWiqrLrpJuVdFAPmtFKUnvtQ1mO0muhNq/pub?gid=0&single=true&output=csv';

// FUNCIONES GLOBALES
// En la función switchTab, asegúrate que tenga esto:
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
    
    if (tabName === 'ranking') {
        // Cargar ranking automáticamente
        setTimeout(() => {
            if (typeof renderRanking === 'function') {
                renderRanking();
            } else {
                console.warn('⚠️ renderRanking no está definido');
                // Mostrar estado de error
                const content = document.getElementById('rankingContent');
                const noData = document.getElementById('rankingNoData');
                const loading = document.getElementById('rankingLoading');
                
                if (loading) loading.style.display = 'none';
                if (content) content.style.display = 'none';
                if (noData) {
                    noData.style.display = 'block';
                    noData.innerHTML = `
                        <div class="no-data-icon">⚠️</div>
                        <h3>Error cargando ranking</h3>
                        <p>La función renderRanking no está disponible.</p>
                        <button class="btn btn-primary" onclick="location.reload()">
                            Recargar página
                        </button>
                    `;
                }
            }
        }, 100);
    }
};


