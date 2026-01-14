// ===== Tabla y Ranking =====
function renderTable(data) {
  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');
  const headers = ['Ejecutivo', 'Habilidad Comercial', 'Tipo de Llamada'];

  tableHead.innerHTML = '<tr>' + headers.map(h => '<th>' + h + '</th>').join('') + '</tr>';

  tableBody.innerHTML = data.map(row => 
    '<tr>' +
    headers.map(h => {
      let val = row[h];
      if (val === 'SI') val = '<span class="badge badge-success">SI</span>';
      if (val === 'NO') val = '<span class="badge badge-error">NO</span>';
      return '<td>' + val + '</td>';
    }).join('') +
    '</tr>'
  ).join('');
}

function renderRanking(data) {
  const rankingBody = document.getElementById('rankingBody');
  const sorted = [...data].sort((a,b) => (b['Habilidad Comercial'] === 'SI') - (a['Habilidad Comercial'] === 'SI'));
  rankingBody.innerHTML = sorted.map(r => 
    `<tr><td>${r.Ejecutivo}</td><td>${r['Habilidad Comercial']}</td></tr>`
  ).join('');
}
