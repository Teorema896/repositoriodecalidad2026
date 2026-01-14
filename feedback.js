// Variables para feedback
let currentFilteredData = [];

// Inicializar feedback
function initFeedback() {
    populateFeedbackFilters();
}

// Llenar filtros de feedback
function populateFeedbackFilters() {
    if (typeof allData === 'undefined' || allData.length === 0) return;
    
    // Ejecutivos
    const ejecutivos = [...new Set(allData.map(d => d['Ejecutivo']).filter(Boolean))].sort();
    const ejecSelect = document.getElementById('feedbackEjecutivoFilter');
    ejecSelect.innerHTML = '<option value="">Selecciona un ejecutivo...</option>';
    ejecutivos.forEach(ej => {
        const option = document.createElement('option');
        option.value = ej;
        option.textContent = ej;
        ejecSelect.appendChild(option);
    });
    
    // Escuchar cambios
    ejecSelect.addEventListener('change', updateFeedbackFilters);
    document.getElementById('feedbackCampanaFilter').addEventListener('change', renderFeedbackView);
    document.getElementById('feedbackSupervisorFilter').addEventListener('change', renderFeedbackView);
    document.getElementById('feedbackFechaFilter').addEventListener('change', renderFeedbackView);
}

// Actualizar filtros en cascada
function updateFeedbackFilters() {
    const ejecutivo = document.getElementById('feedbackEjecutivoFilter').value;
    const selCamp = document.getElementById('feedbackCampanaFilter');
    const selSup = document.getElementById('feedbackSupervisorFilter');
    const selFecha = document.getElementById('feedbackFechaFilter');
    
    if (!ejecutivo) {
        selCamp.innerHTML = '<option value="">Todas las campañas</option>';
        selSup.innerHTML = '<option value="">Todos los supervisores</option>';
        selFecha.innerHTML = '<option value="">Todas las fechas</option>';
        return;
    }
    
    // Filtrar datos por ejecutivo
    const datosEjecutivo = allData.filter(d => d['Ejecutivo'] === ejecutivo);
    
    // Extraer valores únicos
    const campanas = [...new Set(datosEjecutivo.map(d => d['Campaña']).filter(Boolean))].sort();
    const supervisores = [...new Set(datosEjecutivo.map(d => d['Supervisor']).filter(Boolean))].sort();
    const fechas = [...new Set(datosEjecutivo.map(d => d['Fecha de Evaluación']).filter(Boolean))].sort().reverse();
    
    // Actualizar selects
    selCamp.innerHTML = '<option value="">Todas las campañas</option>';
    campanas.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        selCamp.appendChild(opt);
    });
    
    selSup.innerHTML = '<option value="">Todos los supervisores</option>';
    supervisores.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        selSup.appendChild(opt);
    });
    
    selFecha.innerHTML = '<option value="">Todas las fechas</option>';
    fechas.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.textContent = f;
        selFecha.appendChild(opt);
    });
    
    renderFeedbackView();
}

// Renderizar vista de feedback
function renderFeedbackView() {
    const ejecutivo = document.getElementById('feedbackEjecutivoFilter').value;
    const campana = document.getElementById('feedbackCampanaFilter').value;
    const supervisor = document.getElementById('feedbackSupervisorFilter').value;
    const fecha = document.getElementById('feedbackFechaFilter').value;
    
    const emptyState = document.getElementById('feedbackEmptyState');
    const results = document.getElementById('feedbackResults');
    
    if (!ejecutivo) {
        emptyState.style.display = 'block';
        results.style.display = 'none';
        return;
    }
    
    // Filtrar datos
    currentFilteredData = allData.filter(d => {
        return d['Ejecutivo'] === ejecutivo &&
               (!campana || d['Campaña'] === campana) &&
               (!supervisor || d['Supervisor'] === supervisor) &&
               (!fecha || d['Fecha de Evaluación'] === fecha);
    });
    
    if (currentFilteredData.length === 0) {
        emptyState.style.display = 'block';
        results.style.display = 'none';
        emptyState.textContent = 'No hay registros con esos filtros.';
    } else {
        emptyState.style.display = 'none';
        results.style.display = 'block';
    }
}

// Cargar observaciones
function cargarObservaciones() {
    const ejecutivo = document.getElementById('feedbackEjecutivoFilter').value;
    if (!ejecutivo) {
        alert('Selecciona un ejecutivo primero');
        return;
    }
    
    // Mostrar en modal o en la misma página
    const posContainer = document.getElementById('positiveContainer');
    const impContainer = document.getElementById('improvementContainer');
    
    posContainer.innerHTML = '';
    impContainer.innerHTML = '';
    
    currentFilteredData.forEach(d => {
        const fecha = d['Fecha de Evaluación'] || 'Sin fecha';
        
        if (d['Observaciones Positivas']) {
            const div = document.createElement('div');
            div.style.cssText = 'margin-bottom: 12px; padding: 10px; background: rgba(16,185,129,0.05); border-radius: 6px;';
            div.innerHTML = `<div style="font-size:12px;color:#666;margin-bottom:4px;">📅 ${fecha}</div><div>${d['Observaciones Positivas']}</div>`;
            posContainer.appendChild(div);
        }
        
        if (d['Observaciones Mejora']) {
            const div = document.createElement('div');
            div.style.cssText = 'margin-bottom: 12px; padding: 10px; background: rgba(239,68,68,0.05); border-radius: 6px;';
            div.innerHTML = `<div style="font-size:12px;color:#666;margin-bottom:4px;">📅 ${fecha}</div><div>${d['Observaciones Mejora']}</div>`;
            impContainer.appendChild(div);
        }
    });
    
    if (posContainer.children.length === 0) {
        posContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#666;font-style:italic;">Sin observaciones positivas.</div>';
    }
    
    if (impContainer.children.length === 0) {
        impContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#666;font-style:italic;">Sin oportunidades de mejora.</div>';
    }
    
    // Scroll a resultados
    document.getElementById('feedbackResults').scrollIntoView({ behavior: 'smooth' });
}

// Inicializar cuando se cambia a la pestaña feedback
document.addEventListener('DOMContentLoaded', function() {
    // Escuchar cambio de pestaña
    document.querySelectorAll('[data-tab="feedback"]').forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(initFeedback, 100);
        });
    });
});
