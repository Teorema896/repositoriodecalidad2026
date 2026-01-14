// Datos ficticios de usuarios
const users = [
    { username: 'calidad', password: 'dejahair', role: 'calidad' },
    { username: 'operaciones', password: 'Operaciones 2026', role: 'operaciones' }
];

// Función de login simple
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        sessionStorage.setItem('role', user.role);
        applyRole(user.role);
        alert(`Bienvenido ${username}`);
        return true;
    } else {
        alert('Usuario o contraseña incorrectos');
        return false;
    }
}

// Mostrar botones según rol
function applyRole(role) {
    const items = document.querySelectorAll('#menu li');
    items.forEach(item => {
        if (item.dataset.role !== role) {
            item.classList.add('hidden');
        } else {
            item.classList.remove('hidden');
        }
    });
}

// Demo: escucha click en menú
document.addEventListener('DOMContentLoaded', () => {
    // Pedimos login al abrir (solo para test)
    const username = prompt('Usuario:');
    const password = prompt('Contraseña:');
    if (!login(username, password)) return;

    const menuItems = document.querySelectorAll('#menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('demo-content').textContent = `Has seleccionado: ${item.textContent}`;
        });
    });
});
