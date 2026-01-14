// Funciones básicas de análisis
function renderAnalysis() {
    const analysisDiv = document.getElementById('analysisNarrative');
    if (!analysisDiv) return;
    
    const total = filteredData.length || allData.length;
    
    analysisDiv.innerHTML = `
        <div style="padding: 16px; background: var(--color-surface); border-radius: 8px; border: 1px solid var(--color-border);">
            <h3 style="margin-bottom: 12px; color: var(--color-primary);">Análisis de Datos</h3>
            <p>Total de registros analizados: <strong>${total}</strong></p>
            <p>Esta sección está en desarrollo. Próximamente incluirá:</p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Análisis de tendencias</li>
                <li>Comparativas por campaña</li>
                <li>Recomendaciones automatizadas</li>
                <li>Reportes ejecutivos</li>
            </ul>
            <p style="color: var(--color-text-secondary); font-size: 12px; margin-top: 16px;">
                Actualiza los filtros en el Dashboard para analizar datos específicos.
            </p>
        </div>
    `;
}

// Inicializar análisis
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar análisis al cambiar a la pestaña
    document.querySelectorAll('[data-tab="analisis"]').forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(renderAnalysis, 100);
        });
    });
});
