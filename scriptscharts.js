// ===== Gráficos =====
function renderCharts(data) {
  const ctx1 = document.getElementById('chart1').getContext('2d');
  const ctx2 = document.getElementById('chart2').getContext('2d');
  
  const habilidadCount = { SI: 0, NO: 0 };
  data.forEach(d => { habilidadCount[d['Habilidad Comercial']] = (habilidadCount[d['Habilidad Comercial']]||0)+1; });

  new Chart(ctx1, {
    type: 'doughnut',
    data: { labels: ['SI','NO'], datasets: [{ data: [habilidadCount.SI, habilidadCount.NO], backgroundColor: ['#32b8c6','#ff5459'] }] },
    options: { responsive:true, plugins:{title:{display:true,text:'Habilidad Comercial'}} }
  });

  const tipoCount = {};
  data.forEach(d => { tipoCount[d['Tipo de Llamada']] = (tipoCount[d['Tipo de Llamada']]||0)+1; });
  new Chart(ctx2, {
    type: 'bar',
    data: { labels: Object.keys(tipoCount), datasets: [{ label:'Cantidad', data: Object.values(tipoCount), backgroundColor:'#21808d' }] },
    options:{ responsive:true, plugins:{title:{display:true,text:'Tipo de Llamada'}} }
  });
}
