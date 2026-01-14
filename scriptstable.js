import { clearElement, showMessage } from './utils.js';

let globalData = []; // Contendrá todos los registros
let filteredData = []; // Datos filtrados según búsqueda o ranking

// ===============================
// Inicializar datos
// ===============================
export function setTableData(data) {
  globalData = data.map((d, idx) => ({ ...d, ranking: 0 }));
  filteredData = [...globalData];
  renderTable(filteredData);
}

// ===============================
// Renderizar tabla
// ===============================
export function renderTable(data) {
  const tableBody = document.getElementById('table-body');
  if (!tableBody) return;

  clearElement(tableBody);

  if (data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="5" style="text-align:center;">No hay datos disponibles</td>';
    tableBody.appendChild(tr);
    return;
  }

  data.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.ranking || idx + 1}</td>
      <td>${row.nombre}</td>
      <td>${row.ventas}</td>
      <td>${row.campana || '-'}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="alert('Detalles de ${row.nombre}')">👁️ VER</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

// ===============================
// Filtrado de tabla
// ===============================
export function filterTable(query) {
  query = query.toLowerCase();
  filteredData = globalData.filter(row =>
    row.nombre.toLowerCase().includes(query)
  );
  renderTable(filteredData);
}

// ===============================
// Generar ranking
// ===============================
export function generateRanking() {
  filteredData.sort((a, b) => b.ventas - a.ventas);
  filteredData.forEach((row, idx) => (row.ranking = idx + 1));
  renderTable(filteredData);
  showMessage('Ranking actualizado', 'success');
}
