// ========== ranking.js ==========
console.log('✅ ranking.js cargado');

// Función principal - se llama automáticamente
window.renderRanking = function() {
    console.log('🏆 Iniciando cálculo automático de ranking...');
    
    // Mostrar loading
    const loading = document.getElementById('rankingLoading');
    const content = document.getElementById('rankingContent');
    const noData = document.getElementById('rankingNoData');
    
    if (loading) loading.style.display = 'flex';
    if (content) content.style.display = 'none';
    if (noData) noData.style.display = 'none';
    
    // Verificar si hay datos
    if (!window.allData || window.allData.length === 0) {
        console.log('No hay datos para ranking');
        setTimeout(() => {
            if (loading) loading.style.display = 'none';
            if (noData) {
                noData.style.display = 'block';
                noData.innerHTML = `
                    <div class="no-data-icon">📊</div>
                    <h3>No hay auditorías registradas</h3>
                    <p>Ve al Dashboard para cargar datos primero.</p>
                    <button class="btn btn-primary" onclick="switchTab('dashboard')">
                        Ir al Dashboard
                    </button>
                `;
            }
        }, 500);
        return;
    }
    
    // Calcular ranking
    setTimeout(() => {
        try {
            const rankingData = calcularRankingEjecutivos();
            
            // Actualizar estadísticas
            actualizarEstadisticas(rankingData);
            
            // Generar HTML del ranking
            const html = generarHTMLRanking(rankingData);
            
            // Mostrar contenido
            if (loading) loading.style.display = 'none';
            if (content) {
                content.innerHTML = html;
                content.style.display = 'block';
            }
            
            console.log('✅ Ranking generado:', rankingData.length, 'ejecutivos');
            
        } catch (error) {
            console.error('❌ Error calculando ranking:', error);
            if (loading) loading.style.display = 'none';
            if (noData) {
                noData.style.display = 'block';
                noData.innerHTML = `
                    <div class="no-data-icon">⚠️</div>
                    <h3>Error al calcular ranking</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-secondary" onclick="renderRanking()">
                        Reintentar
                    </button>
                `;
            }
        }
    }, 800);
};

// Función para calcular ranking
function calcularRankingEjecutivos() {
    if (!window.allData || window.allData.length === 0) return [];
    
    const ejecutivos = {};
    
    // Procesar datos
    window.allData.forEach(registro => {
        const ejecutivo = registro['Ejecutivo'];
        if (!ejecutivo) return;
        
        if (!ejecutivos[ejecutivo]) {
            ejecutivos[ejecutivo] = {
                ejecutivo: ejecutivo,
                total: 0,
                ventas: 0,
                habilidadesPositivas: 0,
                habilidadesTotales: 0
            };
        }
        
        const datos = ejecutivos[ejecutivo];
        datos.total++;
        
        // Contar ventas
        if (registro['Tipo de Llamada'] === 'Venta') {
            datos.ventas++;
        }
        
        // Evaluar habilidades
        const habilidades = ['Habilidad comercial', 'Sondeo', 'Rebate', 'Genera Necesidad'];
        habilidades.forEach(habilidad => {
            if (registro[habilidad]) {
                datos.habilidadesTotales++;
                if (registro[habilidad] === 'SI') {
                    datos.habilidadesPositivas++;
                }
            }
        });
    });
    
    // Calcular puntuaciones
    const rankingArray = Object.values(ejecutivos).map(ej => {
        const porcentajeVentas = ej.total > 0 ? (ej.ventas / ej.total) * 100 : 0;
        const porcentajeHabilidades = ej.habilidadesTotales > 0 ? (ej.habilidadesPositivas / ej.habilidadesTotales) * 100 : 0;
        
        // Puntuación ponderada: 40% ventas, 60% habilidades
        const puntuacion = Math.round((porcentajeVentas * 0.4) + (porcentajeHabilidades * 0.6));
        
        // Determinar nota
        const nota = obtenerNota(puntuacion);
        
        return {
            ...ej,
            porcentajeVentas: Math.round(porcentajeVentas),
            porcentajeHabilidades: Math.round(porcentajeHabilidades),
            puntuacion: puntuacion,
            nota: nota,
            color: obtenerColorNota(nota)
        };
    });
    
    // Ordenar por puntuación (mayor a menor)
    return rankingArray.sort((a, b) => b.puntuacion - a.puntuacion);
}

function obtenerNota(puntuacion) {
    if (puntuacion >= 90) return 'A+';
    if (puntuacion >= 85) return 'A';
    if (puntuacion >= 80) return 'A-';
    if (puntuacion >= 75) return 'B+';
    if (puntuacion >= 70) return 'B';
    if (puntuacion >= 65) return 'B-';
    if (puntuacion >= 60) return 'C+';
    if (puntuacion >= 55) return 'C';
    if (puntuacion >= 50) return 'C-';
    if (puntuacion >= 40) return 'D';
    return 'F';
}

function obtenerColorNota(nota) {
    const colores = {
        'A+': '#10B981', 'A': '#10B981', 'A-': '#10B981',
        'B+': '#3B82F6', 'B': '#3B82F6', 'B-': '#3B82F6',
        'C+': '#F59E0B', 'C': '#F59E0B', 'C-': '#F59E0B',
        'D': '#EF4444', 'F': '#DC2626'
    };
    return colores[nota] || '#6B7280';
}

function actualizarEstadisticas(rankingData) {
    if (rankingData.length === 0) return;
    
    // Total ejecutivos
    document.getElementById('totalEjecutivos').textContent = rankingData.length;
    
    // Promedio general
    const promedio = Math.round(rankingData.reduce((sum, ej) => sum + ej.puntuacion, 0) / rankingData.length);
    document.getElementById('promedioGeneral').textContent = promedio + '%';
    
    // Mejor puntuación
    const mejor = rankingData[0] ? rankingData[0].puntuacion : 0;
    document.getElementById('mejorPuntuacion').textContent = mejor + '%';
    
    // Hora actual
    const ahora = new Date();
    document.getElementById('ultimaActualizacion').textContent = 
        ahora.getHours().toString().padStart(2, '0') + ':' + 
        ahora.getMinutes().toString().padStart(2, '0');
}

function generarHTMLRanking(rankingData) {
    if (rankingData.length === 0) return '<p>No hay datos para mostrar</p>';
    
    return `
        <!-- Podio Top 3 -->
        <div class="podio-container">
            ${rankingData.slice(0, 3).map((ej, index) => `
                <div class="podio-item podio-${index}">
                    <div class="podio-medal">${['🥇', '🥈', '🥉'][index]}</div>
                    <div class="podio-name">${ej.ejecutivo}</div>
                    <div class="podio-score" style="color: ${ej.color}">${ej.puntuacion}%</div>
                    <div class="podio-nota" style="background: ${ej.color}20; color: ${ej.color}">
                        ${ej.nota}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Tabla completa -->
        <div class="ranking-table-container">
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Ejecutivo</th>
                        <th>Puntuación</th>
                        <th>Nota</th>
                        <th>Auditorías</th>
                        <th>% Ventas</th>
                        <th>% Habilidades</th>
                    </tr>
                </thead>
                <tbody>
                    ${rankingData.map((ej, index) => `
                        <tr class="${index < 3 ? 'top-row' : ''}">
                            <td class="position-cell">
                                ${index < 3 ? 
                                    `<span class="medal-icon">${['🥇', '🥈', '🥉'][index]}</span>` : 
                                    `<span class="position-number">${index + 1}</span>`
                                }
                            </td>
                            <td class="name-cell">
                                <strong>${ej.ejecutivo}</strong>
                                ${ej.total >= 10 ? '<span class="exp-badge">💎</span>' : ''}
                            </td>
                            <td class="score-cell">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${ej.puntuacion}%; background: ${ej.color}"></div>
                                    <span class="score-text">${ej.puntuacion}%</span>
                                </div>
                            </td>
                            <td class="grade-cell">
                                <span class="grade-badge" style="background: ${ej.color}20; color: ${ej.color}; border-color: ${ej.color}">
                                    ${ej.nota}
                                </span>
                            </td>
                            <td class="audits-cell">${ej.total}</td>
                            <td class="sales-cell">${ej.porcentajeVentas}%</td>
                            <td class="skills-cell">${ej.porcentajeHabilidades}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Pie de página -->
        <div class="ranking-footer">
            <div class="footer-note">
                <strong>Metodología:</strong> Puntuación calculada como 40% ventas + 60% habilidades comerciales
            </div>
            <div class="footer-actions">
                <button class="btn btn-secondary" onclick="exportarRanking()">
                    📥 Exportar CSV
                </button>
                <button class="btn btn-secondary" onclick="imprimirRanking()">
                    🖨️ Imprimir
                </button>
            </div>
        </div>
    `;
}

// Funciones auxiliares
window.exportarRanking = function() {
    alert('Función de exportación en desarrollo');
};

window.imprimirRanking = function() {
    window.print();
};

// Inicialización automática si estamos en la pestaña ranking
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la pestaña ranking al cargar
    const rankingTab = document.getElementById('ranking');
    if (rankingTab && rankingTab.classList.contains('active')) {
        setTimeout(renderRanking, 500);
    }
});
