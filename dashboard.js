// dashboard.js - CONEXIÓN A GOOGLE SHEETS
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTR4TBW_qQtsV-yHeyv_EJhixz5qW1AFxXyWLZYxEa95MrUWiqrLrpJuVdFAPmtFKUnvtQ1mO0muhNq/pub?gid=0&single=true&output=csv';
// Variables globales
let allData = [];
let filteredData = [];
let chartInstances = [];

// Cargar datos de Google Sheets
function loadDataFromGoogleSheets() {
    console.log('🔄 Intentando cargar datos de Google Sheets...');
    
    const loading = document.getElementById('loadingMessage');
    if (loading) loading.style.display = 'block';
    
    // Agregar timestamp para evitar cache
    const timestamp = new Date().getTime();
    const url = `${GOOGLE_SHEETS_CSV_URL}&t=${timestamp}`;
    
    console.log('URL:', url);
    
    fetch(url)
        .then(response => {
            console.log('Respuesta recibida:', response.status);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            return response.text();
        })
        .then(csvText => {
            console.log('CSV recibido, longitud:', csvText.length);
            
            // Parsear CSV
            const parsed = parseCSV(csvText);
            console.log('Filas parseadas:', parsed.length);
            
            if (parsed.length > 1) {
                const headers = parsed[0];
                console.log('Headers:', headers);
                
                allData = parsed.slice(1)
                    .filter(row => row.some(cell => cell && cell.trim()))
                    .map(row => {
                        const obj = {};
                        headers.forEach((header, idx) => {
                            obj[header.trim()] = (row[idx] || '').trim();
                        });
                        return obj;
                    });
                    
                console.log('Datos procesados:', allData.length, 'registros');
                
                // Actualizar UI
                if (loading) loading.style.display = 'none';
                
                // Mostrar mensaje
                if (typeof showMessage === 'function') {
                    showMessage(`✅ ${allData.length} registros cargados`, 'success');
                }
                
                // Actualizar timestamp
                const now = new Date();
                const lastUpdate = document.getElementById('lastUpdate');
                if (lastUpdate) {
                    lastUpdate.textContent = `Actualizado: ${now.toLocaleTimeString('es-PE')}`;
                }
                
                // Inicializar dashboard
                initDashboard();
                
            } else {
                console.warn('CSV vacío o con solo headers');
                if (loading) loading.style.display = 'none';
                if (typeof showMessage === 'function') {
                    showMessage('⚠️ No hay datos en la hoja de cálculo', 'error');
                }
            }
        })
        .catch(error => {
            console.error('❌ Error cargando datos:', error);
            if (loading) loading.style.display = 'none';
            if (typeof showMessage === 'function') {
                showMessage('⚠️ Error conectando a Google Sheets', 'error');
            }
            // Cargar datos de demostración
            loadDemoData();
        });
}

// Datos de demostración (si falla Google Sheets)
function loadDemoData() {
    console.log('📋 Cargando datos de demostración...');
    
    allData = [
        {
            'Ejecutivo': 'Juan Pérez',
            'Supervisor': 'Ivan Aguirre Córdova',
            'Campaña': 'Deepening',
            'Tipo de Llamada': 'Venta',
            'Fecha de Evaluación': '2024-01-15',
            'Habilidad comercial': 'SI',
            'Sondeo': 'SI',
            'Rebate': 'NO',
            'Genera Necesidad': 'SI',
            'Motivo No Venta': 'N/A',
            'Observaciones Positivas': 'Excelente tono de voz',
            'Observaciones Mejora': 'Debe mejorar el rebate'
        },
        {
            'Ejecutivo': 'María García',
            'Supervisor': 'Ronny Paliza Cabezas',
            'Campaña': 'Préstamos',
            'Tipo de Llamada': 'No Venta',
            'Fecha de Evaluación': '2024-01-16',
            'Habilidad comercial': 'NO',
            'Sondeo': 'SI',
            'Rebate': 'SI',
            'Genera Necesidad': 'NO',
            'Motivo No Venta': 'Cliente reacio',
            'Observaciones Positivas': 'Buena presentación',
            'Observaciones Mejora': 'Falta generar necesidad'
        }
    ];
    
    console.log('Datos demo cargados:', allData.length, 'registros');
    initDashboard();
}

// Parsear CSV
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        return values.map(v => v.trim());
    });
}

// Inicializar dashboard
function initDashboard() {
    console.log('🎯 Inicializando dashboard...');
    
    // Llenar filtros
    populateFilters();
    
    // Renderizar
    applyFilters();
    
    // Asignar eventos
    const ejecutivoFilter = document.getElementById('ejecutivoFilter');
    const campanaFilter = document.getElementById('campanaFilter');
    const searchInput = document.querySelector('.search-box');
    
    if (ejecutivoFilter) ejecutivoFilter.addEventListener('change', applyFilters);
    if (campanaFilter) campanaFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
}

// Llenar filtros
function populateFilters() {
    if (!allData.length) return;
    
    // Ejecutivos
    const ejecutivos = [...new Set(allData.map(d => d['Ejecutivo']).filter(Boolean))].sort();
    const ejecSelect = document.getElementById('ejecutivoFilter');
    if (ejecSelect) {
        ejecSelect.innerHTML = '<option value="">Todos los ejecutivos</option>';
        ejecutivos.forEach(ej => {
            const option = document.createElement('option');
            option.value = ej;
            option.textContent = ej;
            ejecSelect.appendChild(option);
        });
    }
}

// Aplicar filtros
function applyFilters() {
    const ejecutivo = document.getElementById('ejecutivoFilter')?.value || '';
    const campana = document.getElementById('campanaFilter')?.value || '';
    const searchQuery = document.querySelector('.search-box')?.value.toLowerCase() || '';
    
    filteredData = allData.filter(d => {
        const matchEjecutivo = !ejecutivo || d['Ejecutivo'] === ejecutivo;
        const matchCampana = !campana || d['Campaña'] === campana;
        const matchSearch = !searchQuery || Object.values(d).some(val => 
            String(val).toLowerCase().includes(searchQuery)
        );
        return matchEjecutivo && matchCampana && matchSearch;
    });
    
    console.log('Datos filtrados:', filteredData.length);
    renderDashboard();
}

// Limpiar filtros
window.clearFilters = function() {
    const ejecSelect = document.getElementById('ejecutivoFilter');
    const campSelect = document.getElementById('campanaFilter');
    const searchInput = document.querySelector('.search-box');
    
    if (ejecSelect) ejecSelect.value = '';
    if (campSelect) campSelect.value = '';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
};

// Inicializar cuando se carga la página
if (document.getElementById('dashboard')) {
    console.log('Dashboard detectado, cargando datos...');
    setTimeout(() => loadDataFromGoogleSheets(), 500);
}

