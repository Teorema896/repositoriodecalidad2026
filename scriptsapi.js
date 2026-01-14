<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scotiabank | Dashboard de Calidad</title>
  <link rel="icon" href="assets/favicon.ico">
  <link rel="stylesheet" href="styles/main.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">

    <!-- Header -->
    <header>
      <h1>📊 Dashboard de Calidad - Scotiabank</h1>
      <p class="subtitle">Sistema de Auditoría y Seguimiento de Llamadas</p>
    </header>

    <!-- Fecha y hora -->
    <div class="fecha-actual-box">
      <div>
        <div class="fecha-label">📅 Fecha de Evaluación</div>
        <div class="fecha-valor" id="fechaActual"></div>
      </div>
      <div>
        <div class="fecha-label">🕐 Hora actual</div>
        <div class="fecha-valor" id="horaActual"></div>
      </div>
    </div>

    <!-- Mensajes de carga / errores -->
    <div id="loadingMessage" class="loading">🔄 Cargando datos desde Google Sheets...</div>
    <div id="messageContainer"></div>

    <!-- Filtros -->
    <div class="filter-section">
      <div class="filter-grid">
        <div class="filter-group">
          <label class="filter-label">🔍 Filtrar por Ejecutivo</label>
          <select id="ejecutivoFilter" class="form-control"></select>
        </div>
        <div class="filter-group">
          <button class="btn btn-secondary" id="clearFilterBtn">Limpiar Filtro</button>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpis" id="kpisContainer"></div>

    <!-- Acciones -->
    <div class="actions">
      <button class="btn btn-primary" id="toggleFormBtn">➕ Agregar Nueva Auditoría</button>
      <button class="btn btn-secondary" id="exportCSVBtn">📥 Exportar a CSV</button>
      <button class="btn btn-secondary" id="showRankingBtn">🏆 Ranking</button>
    </div>

    <!-- Formulario -->
    <div class="form-section collapsed" id="formSection">
      <h2 class="section-title">Nueva Auditoría</h2>
      <form id="auditForm"></form>
    </div>

    <!-- Gráficos -->
    <div class="charts-grid" id="chartsContainer"></div>

    <!-- Tabla principal -->
    <div class="table-container">
      <input type="text" class="search-box" id="searchBox" placeholder="🔍 Buscar...">
      <table>
        <thead id="tableHead"></thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>

    <!-- Modal de detalle -->
    <div id="detailModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span>📋 Detalles de Auditoría</span>
          <button class="modal-close" id="closeModalBtn">✕</button>
        </div>
        <div id="modalBody"></div>
      </div>
    </div>

  </div>

  <!-- Scripts -->
  <script src="scripts/api.js"></script>
  <script src="scripts/form.js"></script>
  <script src="scripts/table.js"></script>
  <script src="scripts/charts.js"></script>
  <script src="scripts/main.js"></script>
</body>
</html>
