document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('login-error');

    const menuBtns = document.querySelectorAll('.menu-btn');

    const usuarios = {
        calidad: 'dejahair',
        operaciones: 'Operaciones 2026'
    };

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (usuarios[username] && usuarios[username] === password) {
            // Login correcto
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';

            // Mostrar solo botones del rol correspondiente
            menuBtns.forEach(btn => {
                if (btn.dataset.role !== username) btn.style.display = 'none';
                else btn.style.display = 'block';
            });
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos';
        }
    });

    // Función para manejar clicks del menú
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dashboardSection.innerHTML = `<h3>${btn.textContent}</h3><p>Sección de ${btn.textContent} en desarrollo...</p>`;
        });
    });
});
