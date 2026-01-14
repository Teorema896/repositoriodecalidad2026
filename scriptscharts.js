import Chart from 'chart.js/auto';

const chartInstances = {}; // Guardar instancias de gráficos

// ===============================
// Crear un gráfico
// ===============================
export function createChart(id, type, data, options = {}) {
  const ctx = document.getElementById(id);
  if (!ctx) return;

  if (chartInstances[id]) chartInstances[id].destroy();

  chartInstances[id] = new Chart(ctx, {
    type,
    data,
    options,
  });

  return chartInstances[id];
}

// ===============================
// Actualizar un gráfico existente
// ===============================
export function updateChart(id, newData) {
  const chart = chartInstances[id];
  if (!chart) return;

  chart.data = newData;
  chart.update();
}
