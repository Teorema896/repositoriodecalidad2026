// Manejar formulario de gestión de calidad
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('auditForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar
        const required = form.querySelectorAll('[required]');
        let isValid = true;
        
        required.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--color-error)';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            alert('Por favor completa todos los campos requeridos (*)');
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Aquí iría la lógica para enviar a Google Sheets
        console.log('Datos a guardar:', data);
        
        // Mostrar mensaje de éxito
        alert('✅ Auditoría guardada correctamente (modo demo)\n\nEn producción se enviaría a Google Sheets.');
        
        // Limpiar formulario
        form.reset();
    });
    
    // Inicializar fecha actual
    const now = new Date();
    const fechaInput = form.querySelector('[name="fechaHora"]');
    if (fechaInput) {
        const fechaStr = now.toISOString().slice(0, 16).replace('T', ' ');
        fechaInput.value = fechaStr;
    }
});
