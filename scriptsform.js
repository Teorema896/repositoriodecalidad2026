// ================================
// Formulario de auditoría
// ================================

const auditForm = document.getElementById('auditForm');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const formSection = document.getElementById('formSection');

toggleFormBtn.addEventListener('click', toggleForm);
auditForm.addEventListener('submit', submitForm);

function toggleForm() {
  formSection.classList.toggle('collapsed');
  auditForm.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label>Ejecutivo *</label>
        <input type="text" name="ejecutivo" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Supervisor *</label>
        <select name="supervisor" class="form-control" required>
          <option value="">Seleccionar</option>
          <option value="Ivan Aguirre Córdova">Ivan Aguirre Córdova</option>
          <option value="Ronny Paliza Cabezas">Ronny Paliza Cabezas</option>
        </select>
      </div>
      <div class="form-group">
        <label>Campaña *</label>
        <select name="campana" class="form-control" required>
          <option value="">Seleccionar</option>
          <option value="Deepening">Deepening</option>
          <option value="Préstamos">Préstamos</option>
        </select>
      </div>
      <div class="form-group">
        <label>Fecha y Hora *</label>
        <input type="text" name="fechaHora" class="form-control" placeholder="YYYY-MM-DD HH:MM" required>
      </div>
    </div>
    <div class="actions">
      <button type="submit" class="btn btn-primary">💾 Guardar Auditoría</button>
      <button type="button" class="btn btn-secondary" onclick="toggleForm()">Cancelar</button>
    </div>
  `;
}

async function submitForm(e) {
  e.preventDefault();
  const formData = new FormData(auditForm);
  const data = {};
  formData.forEach((v, k) => data[k] = v);
  data.fechaEvaluacion = new Date().toLocaleDateString('es-PE');
  try {
    await postToAppsScript(data);
    alert('✅ Auditoría guardada!');
    auditForm.reset();
    toggleForm();
    window.dispatchEvent(new Event('dataUpdated'));
  } catch {
    alert('⚠️ Error al guardar auditoría');
  }
}
