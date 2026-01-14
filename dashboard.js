// ========== dashboard.js ==========
console.log('✅ dashboard.js cargado');

// NOTA: Usamos window.allData y window.filteredData que están definidos en main.js

// Sobrescribir la función placeholder de main.js
window.loadDataFromGoogleSheets = function() {
    console.log('🔄 Cargando datos de Google Sheets...');
    
    const loading = document.getElementById('loadingMessage');
    if (loading) loading.style.display = 'block';
    
    // Usar la constante global
    const url = window.GOOGLE_SHEETS_CSV_URL;
    const timestamp = new Date().getTime();
    const urlConTimestamp = `${url}&t=${timestamp}`;
    
    console.log('URL:', urlConTimestamp);
    
    fetch(urlConTimestamp)
        .then(response => {
            console.log('Respuesta:', response.status);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            return response.text();
        })
        .then(csvText => {
            console.log('Datos recibidos, procesando...');
            
            // Parsear CSV
            const parsed = parseCSV(csvText);
            
            if (parsed.length > 1) {
                const headers = parsed[0];
                
                // Asignar a la variable global
                window.allData = parsed.slice(1)
                    .filter(row => row.some(cell => cell && cell.trim()))
                    .map(row => {
                        const obj = {};
                        headers.forEach((header, idx) => {
                            obj[header.trim()] = (row[idx] || '').trim();
                        });
                        return obj;
                    });
                    
                console.log('✅ Datos cargados:', window.allData.length, 'registros');
                
                // Actualizar UI
                if (loading) loading.style.display = 'none';
                
                // Mostrar mensaje
                if (typeof showMessage === 'function') {
                    showMessage(`✅ ${window.allData.length} registros cargados`, 'success');
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
                console.warn('CSV vacío');
                if (loading) loading.style.display = 'none';
                loadDemoData();
            }
        })
        .catch(error => {
            console.error('❌ Error:', error);
            if (loading) loading.style.display = 'none';
            loadDemoData();
        });
};

// Función parseCSV
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

// Datos demo
function loadDemoData() {
    console.log('📋 Cargando datos de demostración...');
    
    window.allData = [
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
        },
        {
            'Ejecutivo': 'Carlos López',
            'Supervisor': 'Ivan Aguirre Córdova',
            'Campaña': 'Deepening',
            'Tipo de Llamada': 'Venta',
            'Fecha de Evaluación': '2024-01-17',
            'Habilidad comercial': 'SI',
            'Sondeo': 'NO',
            'Rebate': 'SI',
            'Genera Necesidad': 'SI',
            'Motivo No Venta': 'N/A',
            'Observaciones Positivas': 'Excelente manejo de objeciones',
            'Observaciones Mejora': 'Necesita mejorar sondeo inicial'
        }
    ];
    
    console.log('Datos demo cargados:', window.allData.length);
    initDashboard();
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
    
    console.log('✅ Dashboard inicializado');
}

// Llenar filtros
function populateFilters() {
    if (!window.allData || window.allData.length === 0) {
        console.log('No hay datos para filtrar');
        return;
    }
    
    // Ejecutivos
    const ejecutivos = [...new Set(window.allData.map(d => d['Ejecutivo']).filter(Boolean))].sort();
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
    if (!window.allData) return;
    
    const ejecutivo = document.getElementById('ejecutivoFilter')?.value || '';
    const campana = document.getElementById('campanaFilter')?.value || '';
    const searchQuery = document.querySelector('.search-box')?.value.toLowerCase() || '';
    
    window.filteredData = window.allData.filter(d => {
        const matchEjecutivo = !ejecutivo || d['Ejecutivo'] === ejecutivo;
        const matchCampana = !campana || d['Campaña'] === campana;
        const matchSearch = !searchQuery || Object.values(d).some(val => 
            String(val).toLowerCase().includes(searchQuery)
        );
        return matchEjecutivo && matchCampana && matchSearch;
    });
    
    console.log('Datos filtrados:', window.filteredData.length);
    renderDashboard();
}

// Sobrescribir clearFilters
window.clearFilters = function() {
    const ejecSelect = document.getElementById('ejecutivoFilter');
    const campSelect = document.getElementById('campanaFilter');
    const searchInput = document.querySelector('.search-box');
    
    if (ejecSelect) ejecSelect.value = '';
    if (campSelect) campSelect.value = '';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
    if (typeof showMessage === 'function') {
        showMessage('✅ Filtros limpiados', 'success');
    }
};

// Sobrescribir exportToCSV
window.exportToCSV = function() {
    if (!window.filteredData || window.filteredData.length === 0) {
        if (typeof showMessage === 'function') {
            showMessage('⚠️ No hay datos para exportar', 'error');
        }
        return;
    }
    
    const headers = Object.keys(window.filteredData[0]);
    const csv = [
        headers.join(','),
        ...window.filteredData.map(row => 
            headers.map(header => `"${row[header] || ''}"`).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditorias-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    if (typeof showMessage === 'function') {
        showMessage('✅ CSV exportado correctamente', 'success');
    }
};

// Sobrescribir mostrarRanking
window.mostrarRanking = function() {
    if (!window.allData || window.allData.length === 0) {
        if (typeof showMessage === 'function') {
            showMessage('⚠️ No hay datos para ranking', 'error');
        }
        return;
    }
    
    // Ocultar gráficos y tabla principal
    const charts = document.getElementById('chartsContainer');
    const tables = document.querySelectorAll('.table-container');
    
    if (charts) charts.style.display = 'none';
    if (tables[0]) tables[0].style.display = 'none';
    
    // Mostrar ranking
    const rankingContainer = document.getElementById('rankingContainer');
    if (rankingContainer) {
        rankingContainer.style.display = 'block';
        renderRanking();
    }
};

function renderRanking() {
    if (!window.allData) return;
    
    const resumen = {};
    
    window.allData.forEach(row => {
        const ejecutivo = row['Ejecutivo'];
        if (!ejecutivo) return;
        
        if (!resumen[ejecutivo]) {
            resumen[ejecutivo] = { total: 0, si: 0 };
        }
        
        resumen[ejecutivo].total++;
        
        if (row['Habilidad comercial'] === 'SI') {
            resumen[ejecutivo].si++;
        }
    });
    
    const filas = Object.keys(resumen)
        .map(ej => {
            const total = resumen[ej].total;
            const porcentaje = total > 0
                ? Math.round((resumen[ej].si / total) * 100)
                : 0;
            
            return `<tr>
                <td>${ej}</td>
                <td><strong>${porcentaje}%</strong></td>
                <td>${total} auditorías</td>
            </tr>`;
        })
        .join('');
    
    const tbody = document.getElementById('rankingTableBody');
    if (tbody) tbody.innerHTML = filas;
}

// Renderizar dashboard completo
function renderDashboard() {
    renderKPIs();
    renderCharts();
    renderTable();
}

// Renderizar KPIs
function renderKPIs() {
    const container = document.getElementById('kpisContainer');
    if (!container) return;
    
    const total = window.filteredData ? window.filteredData.length : 0;
    const ventas = window.filteredData ? window.filteredData.filter(d => d['Tipo de Llamada'] === 'Venta').length : 0;
    const habilidadSi = window.filteredData ? window.filteredData.filter(d => d['Habilidad comercial'] === 'SI').length : 0;
    
    container.innerHTML = `
        <div class="kpis-section">
            <div class="kpis-section-title">📊 Total de Auditorías</div>
            <div class="kpis-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Total de Evaluaciones</div>
                    <div class="kpi-value">${total}</div>
                    <div class="kpi-subtitle">auditorías registradas</div>
                </div>
            </div>
        </div>
        <div class="kpis-section">
            <div class="kpis-section-title">📈 Métricas Clave</div>
            <div class="kpis-grid quiebres">
                <div class="kpi-card">
                    <div class="kpi-label">Tasa de Venta</div>
                    <div class="kpi-value">${total > 0 ? Math.round((ventas / total) * 100) : 0}%</div>
                    <div class="kpi-subtitle">${ventas} de ${total} llamadas</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Habilidad Comercial</div>
                    <div class="kpi-value">${total > 0 ? Math.round((habilidadSi / total) * 100) : 0}%</div>
                    <div class="kpi-subtitle">${habilidadSi} evaluaciones positivas</div>
                </div>
            </div>
        </div>
    `;
}

// Renderizar tabla
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const thead = document.getElementById('tableHead');
    
    if (!tbody || !thead) return;
    
    if (!window.filteredData || window.filteredData.length === 0) {
        thead.innerHTML = '<tr><th>No hay datos disponibles</th></tr>';
        tbody.innerHTML = '';
        return;
    }
    
    // Encabezados
    const headers = ['Ejecutivo', 'Campaña', 'Tipo de Llamada', 'Fecha', 'Habilidad Comercial'];
    thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}<th>Acción</th></tr>`;
    
    // Datos (máximo 10 filas)
    tbody.innerHTML = window.filteredData.slice(0, 10).map((row, index) => `
        <tr>
            <td>${row['Ejecutivo'] || ''}</td>
            <td>${row['Campaña'] || ''}</td>
            <td>${row['Tipo de Llamada'] || ''}</td>
            <td>${row['Fecha de Evaluación'] || ''}</td>
            <td><span class="badge ${row['Habilidad comercial'] === 'SI' ? 'badge-success' : 'badge-error'}">${row['Habilidad comercial'] || 'N/A'}</span></td>
            <td><button class="btn btn-secondary btn-sm" onclick="showDetail(${index})">👁️ VER</button></td>
        </tr>
    `).join('');
}

// Función para mostrar detalle
window.showDetail = function(index) {
    if (!window.filteredData || !window.filteredData[index]) return;
    
    const row = window.filteredData[index];
    let html = '';
    
    Object.keys(row).forEach(key => {
        const value = row[key] || '';
        html += `<div class="detail-row">
            <div class="detail-label">${key}</div>
            <div class="detail-value">${value}</div>
        </div>`;
    });
    
    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
        modalBody.innerHTML = html;
    }
    
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'flex';
    }
};

// Renderizar gráficos con Chart.js
function renderCharts() {
    const container = document.getElementById('chartsContainer');
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = `
        <div class="chart-container"><canvas id="chart1"></canvas></div>
        <div class="chart-container"><canvas id="chart2"></canvas></div>
        <div class="chart-container"><canvas id="chart3"></canvas></div>
    `;
    
    // Destruir gráficos anteriores
    if (window.chartInstances) {
        window.chartInstances.forEach(chart => {
            try {
                chart.destroy();
            } catch (e) {
                console.warn('Error destruyendo chart:', e);
            }
        });
        window.chartInstances = [];
    }
    
    if (!window.filteredData || window.filteredData.length === 0) {
        container.innerHTML = '<div class="chart-container"><div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">No hay datos para gráficos</div></div>';
        return;
    }
    
    // Datos para gráficos
    setTimeout(() => {
        try {
            // Gráfico 1: Tipo de Llamada
            const ctx1 = document.getElementById('chart1');
            if (ctx1) {
                const ventas = window.filteredData.filter(d => d['Tipo de Llamada'] === 'Venta').length;
                const noVentas = window.filteredData.filter(d => d['Tipo de Llamada'] === 'No Venta').length;
                
                const chart1 = new Chart(ctx1, {
                    type: 'doughnut',
                    data: {
                        labels: ['Venta', 'No Venta'],
                        datasets: [{
                            data: [ventas, noVentas],
                            backgroundColor: ['#32B8C6', '#FF5459'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Distribución por Tipo de Llamada'
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
                window.chartInstances.push(chart1);
            }
            
            // Gráfico 2: Campañas
            const ctx2 = document.getElementById('chart2');
            if (ctx2) {
                const campanas = {};
                window.filteredData.forEach(d => {
                    const camp = d['Campaña'] || 'Sin campaña';
                    campanas[camp] = (campanas[camp] || 0) + 1;
                });
                
                const chart2 = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(campanas),
                        datasets: [{
                            label: 'Cantidad',
                            data: Object.values(campanas),
                            backgroundColor: '#32B8C6'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Auditorías por Campaña'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                window.chartInstances.push(chart2);
            }
            
            // Gráfico 3: Habilidad Comercial
            const ctx3 = document.getElementById('chart3');
            if (ctx3) {
                const habilidad = {
                    'SI': window.filteredData.filter(d => d['Habilidad comercial'] === 'SI').length,
                    'NO': window.filteredData.filter(d => d['Habilidad comercial'] === 'NO').length,
                    'NA': window.filteredData.filter(d => !d['Habilidad comercial'] || d['Habilidad comercial'] === 'N/A').length
                };
                
                const chart3 = new Chart(ctx3, {
                    type: 'pie',
                    data: {
                        labels: ['SI', 'NO', 'N/A'],
                        datasets: [{
                            data: [habilidad.SI, habilidad.NO, habilidad.NA],
                            backgroundColor: ['#00C49F', '#FF8042', '#A7A9A9']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Habilidad Comercial'
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
                window.chartInstances.push(chart3);
            }
            
        } catch (error) {
            console.error('Error creando gráficos:', error);
            container.innerHTML = '<div class="chart-container"><div style="text-align: center; padding: 40px; color: var(--color-error);">Error cargando gráficos</div></div>';
        }
    }, 100);
}
