// Cargar datos de Google Sheets
function loadDataFromGoogleSheets(silent = false) {
    if (!silent) {
        document.getElementById('loadingMessage').style.display = 'block';
    }

    const timestamp = new Date().getTime();
    const url = `${GOOGLE_SHEETS_CSV_URL}&t=${timestamp}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Error de red: ${response.status}`);
            return response.text();
        })
        .then(csvText => {
            const parsed = parseCSV(csvText);
            
            if (parsed.length > 1) {
                const headers = parsed[0];
                allData = parsed.slice(1)
                    .filter(row => row.some(cell => cell.trim()))
                    .map(row => {
                        const obj = {};
                        headers.forEach((header, idx) => {
                            obj[header.trim()] = (row[idx] || '').trim();
                        });
                        return obj;
                    });
            } else {
                allData = [];
            }

            document.getElementById('loadingMessage').style.display = 'none';
            populateEjecutivoFilter();
            applyFilters();

            const now = new Date();
            document.getElementById('lastUpdate').textContent = 
                `Última actualización: ${now.toLocaleTimeString('es-PE')}`;
        })
        .catch(error => {
            document.getElementById('loadingMessage').style.display = 'none';
            if (!silent) {
                showMessage('⚠️ Error al actualizar datos.', 'error');
            }
        });
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
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values;
    });
}

// Llenar filtro de ejecutivos
function populateEjecutivoFilter() {
    const ejecutivosSet = {};
    allData.forEach(d => {
        if (d['Ejecutivo']) ejecutivosSet[d['Ejecutivo']] = true;
    });
    
    const ejecutivos = Object.keys(ejecutivosSet).sort();
    const select = document.getElementById('ejecutivoFilter');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">Todos los ejecutivos</option>';
    ejecutivos.forEach(ej => {
        const option = document.createElement('option');
        option.value = ej;
        option.textContent = ej;
        if (ej === currentValue) option.selected = true;
        select.appendChild(option);
    });
}

// Aplicar filtros
function applyFilters() {
    currentEjecutivo = document.getElementById('ejecutivoFilter').value;
    currentCampana = document.getElementById('campanaFilter').value;
    const searchQuery = document.querySelector('.search-box').value.toLowerCase();

    filteredData = allData.filter(d => {
        const matchEjecutivo = !currentEjecutivo || d['Ejecutivo'] === currentEjecutivo;
        const matchCampana = !currentCampana || d['Campaña'] === currentCampana;
        const matchSearch = !searchQuery || Object.values(d).some(val => 
            String(val).toLowerCase().includes(searchQuery)
        );
        return matchEjecutivo && matchCampana && matchSearch;
    });

    renderDashboard();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('ejecutivoFilter').value = '';
    document.getElementById('campanaFilter').value = '';
    document.querySelector('.search-box').value = '';
    currentEjecutivo = '';
    currentCampana = '';
    filteredData = allData.slice();
    renderDashboard();
}

// Renderizar dashboard
function renderDashboard() {
    renderKPIs();
    renderCharts();
    renderTable();
}

// Mostrar mensajes
function showMessage(text, type) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="message message-${type}">${text}</div>`;
    setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// Inicializar dashboard
if (document.getElementById('dashboard')) {
    // Asignar eventos a los botones
    document.getElementById('ejecutivoFilter')?.addEventListener('change', applyFilters);
    document.getElementById('campanaFilter')?.addEventListener('change', applyFilters);
    document.querySelector('.search-box')?.addEventListener('input', applyFilters);
}
