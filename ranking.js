// ========== ranking.js ==========
console.log('✅ ranking.js cargado');

// Función principal para renderizar el ranking
window.renderRanking = function() {
    console.log('🏆 Renderizando ranking...');
    
    // Verificar si hay datos
    if (!window.allData || window.allData.length === 0) {
        showMessage('⚠️ No hay datos para generar ranking', 'error');
        return;
    }
    
    // Contenedor del ranking
    const container = document.getElementById('rankingContainer');
    if (!container) {
        console.error('No se encontró el contenedor de ranking');
        return;
    }
    
    // Calcular métricas por ejecutivo
    const rankingData = calcularRanking();
    
    // Generar HTML del ranking
    container.innerHTML = generarHTMLRanking(rankingData);
    
    console.log('✅ Ranking generado:', rankingData.length, 'ejecutivos');
};

// Calcular métricas por ejecutivo
function calcularRanking() {
    const ejecutivos = {};
    
    // Procesar todos los datos
    window.allData.forEach(registro => {
        const ejecutivo = registro['Ejecutivo'];
        if (!ejecutivo) return;
        
        // Inicializar si no existe
        if (!ejecutivos[ejecutivo]) {
            ejecutivos[ejecutivo] = {
                ejecutivo: ejecutivo,
                totalAuditorias: 0,
                ventas: 0,
                habilidadesPositivas: 0,
                totalHabilidades: 0,
                puntuacion: 0,
                nota: '',
                colorNota: ''
            };
        }
        
        const datos = ejecutivos[ejecutivo];
        datos.totalAuditorias++;
        
        // Contar ventas
        if (registro['Tipo de Llamada'] === 'Venta') {
            datos.ventas++;
        }
        
        // Evaluar habilidades (SI = 1 punto, NO = 0 puntos)
        const habilidades = [
            'Habilidad comercial',
            'Sondeo', 
            'Rebate',
            'Genera Necesidad',
            'Cierre de Venta'
        ];
        
        habilidades.forEach(habilidad => {
            if (registro[habilidad]) {
                datos.totalHabilidades++;
                if (registro[habilidad] === 'SI') {
                    datos.habilidadesPositivas++;
                }
            }
        });
    });
    
    // Calcular puntuaciones y convertir a array
    const rankingArray = Object.values(ejecutivos).map(ej => {
        // Porcentaje de ventas (40% del puntaje)
        const porcentajeVentas = ej.totalAuditorias > 0 
            ? (ej.ventas / ej.totalAuditorias) * 100 
            : 0;
        
        // Porcentaje de habilidades (60% del puntaje)
        const porcentajeHabilidades = ej.totalHabilidades > 0
            ? (ej.habilidadesPositivas / ej.totalHabilidades) * 100
            : 0;
        
        // Puntuación final (ponderada)
        ej.puntuacion = Math.round((porcentajeVentas * 0.4) + (porcentajeHabilidades * 0.6));
        
        // Asignar nota y color
        ej.nota = obtenerNota(ej.puntuacion);
        ej.colorNota = obtenerColorNota(ej.nota);
        
        return ej;
    });
    
    // Ordenar por puntuación (de mayor a menor)
    return rankingArray.sort((a, b) => b.puntuacion - a.puntuacion);
}

// Obtener nota según puntuación
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

// Obtener color según nota
function obtenerColorNota(nota) {
    const colores = {
        'A+': '#10B981', // Verde
        'A': '#10B981',
        'A-': '#10B981',
        'B+': '#3B82F6', // Azul
        'B': '#3B82F6',
        'B-': '#3B82F6',
        'C+': '#F59E0B', // Amarillo/Naranja
        'C': '#F59E0B',
        'C-': '#F59E0B',
        'D': '#EF4444',  // Rojo
        'F': '#EF4444'
    };
    return colores[nota] || '#6B7280'; // Gris por defecto
}

// Generar HTML del ranking
function generarHTMLRanking(rankingData) {
    return `
        <div class="ranking-section">
            <div class="ranking-header">
                <h2><span class="ranking-icon">🏆</span> Ranking de Ejecutivos</h2>
                <p class="ranking-subtitle">Evaluación basada en ventas y habilidades comerciales</p>
            </div>
            
            <div class="ranking-info">
                <div class="info-card">
                    <span class="info-icon">📊</span>
                    <div>
                        <div class="info-title">Metodología</div>
                        <div class="info-text">Ventas (40%) + Habilidades (60%)</div>
                    </div>
                </div>
                <div class="info-card">
                    <span class="info-icon">⭐</span>
                    <div>
                        <div class="info-title">Escala de Notas</div>
                        <div class="info-text">A+ (90-100) · A (85-89) · B (70-84) · C (50-69) · D/F (<50)</div>
                    </div>
                </div>
            </div>
            
            <div class="ranking-table-container">
                <table class="ranking-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ejecutivo</th>
                            <th>Puntuación</th>
                            <th>Nota</th>
                            <th>Total Auditorías</th>
                            <th>% Ventas</th>
                            <th>% Habilidades</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rankingData.map((ej, index) => `
                            <tr class="${index < 3 ? 'top-performer' : ''}">
                                <td class="ranking-position">
                                    ${index < 3 ? ['🥇', '🥈', '🥉'][index] : `<span class="position-number">${index + 1}</span>`}
                                </td>
                                <td class="ejecutivo-name">
                                    <strong>${ej.ejecutivo}</strong>
                                    ${ej.totalAuditorias >= 10 ? '<span class="badge-experiencia">💎 Exp</span>' : ''}
                                </td>
                                <td class="puntuacion">
                                    <div class="progress-bar-container">
                                        <div class="progress-bar" style="width: ${ej.puntuacion}%; background: ${ej.colorNota};"></div>
                                        <span class="puntuacion-text">${ej.puntuacion}%</span>
                                    </div>
                                </td>
                                <td class="nota">
                                    <span class="nota-badge" style="background: ${ej.colorNota}20; color: ${ej.colorNota}; border: 1px solid ${ej.colorNota}40;">
                                        ${ej.nota}
                                    </span>
                                </td>
                                <td class="auditorias">${ej.totalAuditorias}</td>
                                <td class="ventas">
                                    ${ej.totalAuditorias > 0 ? Math.round((ej.ventas / ej.totalAuditorias) * 100) : 0}%
                                    <div class="mini-bar">
                                        <div style="width: ${ej.totalAuditorias > 0 ? (ej.ventas / ej.totalAuditorias) * 100 : 0}%; background: #10B981;"></div>
                                    </div>
                                </td>
                                <td class="habilidades">
                                    ${ej.totalHabilidades > 0 ? Math.round((ej.habilidadesPositivas / ej.totalHabilidades) * 100) : 0}%
                                    <div class="mini-bar">
                                        <div style="width: ${ej.totalHabilidades > 0 ? (ej.habilidadesPositivas / ej.totalHabilidades) * 100 : 0}%; background: #3B82F6;"></div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="ranking-footer">
                <div class="footer-actions">
                    <button class="btn btn-primary" onclick="exportarRanking()">
                        <span>📥</span> Exportar Ranking
                    </button>
                    <button class="btn btn-secondary" onclick="imprimirRanking()">
                        <span>🖨️</span> Imprimir
                    </button>
                </div>
                <div class="footer-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total evaluados:</span>
                        <span class="stat-value">${rankingData.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Puntuación promedio:</span>
                        <span class="stat-value">${Math.round(rankingData.reduce((sum, ej) => sum + ej.puntuacion, 0) / rankingData.length)}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para exportar ranking a CSV
window.exportarRanking = function() {
    if (!window.allData || window.allData.length === 0) {
        showMessage('⚠️ No hay datos para exportar', 'error');
        return;
    }
    
    const rankingData = calcularRanking();
    
    const headers = ['Posición', 'Ejecutivo', 'Puntuación', 'Nota', 'Total Auditorías', 'Ventas', '% Ventas', 'Habilidades Positivas', '% Habilidades'];
    
    const csv = [
        headers.join(','),
        ...rankingData.map((ej, index) => [
            index + 1,
            `"${ej.ejecutivo}"`,
            ej.puntuacion,
            ej.nota,
            ej.totalAuditorias,
            ej.ventas,
            ej.totalAuditorias > 0 ? Math.round((ej.ventas / ej.totalAuditorias) * 100) : 0,
            ej.habilidadesPositivas,
            ej.totalHabilidades > 0 ? Math.round((ej.habilidadesPositivas / ej.totalHabilidades) * 100) : 0
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ranking-ejecutivos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('✅ Ranking exportado correctamente', 'success');
};

// Función para imprimir ranking
window.imprimirRanking = function() {
    const rankingContent = document.querySelector('.ranking-section');
    if (!rankingContent) return;
    
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ranking de Ejecutivos - Scotiabank</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #2d8c9c; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .nota { font-weight: bold; }
                @media print {
                    .no-print { display: none; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>🏆 Ranking de Ejecutivos</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')}</p>
            ${rankingContent.innerHTML}
            <div style="margin-top: 30px; font-size: 12px; color: #666;">
                <p>Generado automáticamente por Sistema de Calidad Scotiabank</p>
            </div>
        </body>
        </html>
    `);
    ventana.document.close();
    setTimeout(() => ventana.print(), 500);
};

console.log('✅ ranking.js listo');
