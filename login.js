// USUARIOS Y CONTRASEÑAS
const USER_DB = [
    { user: 'qa01', pass: 'Calidad2025', role: 'calidad', name: 'Calidad' },
    { user: 'ops01', pass: 'Operaciones2025', role: 'operaciones', name: 'Operaciones' }
];

// Mostrar/ocultar ayuda de usuarios
function toggleLoginHelp() {
    const help = document.getElementById('loginHelp');
    help.style.display = help.style.display === 'none' ? 'block' : 'none';
}

// Mostrar mensaje de login
function showLoginMsg(message) {
    const msgBox = document.getElementById('loginMsg');
    msgBox.textContent = message;
    msgBox.style.display = 'block';
}

// Manejar login
function handleLogin() {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    
    // Validar campos
    if (!username || !password) {
        showLoginMsg('Por favor ingresa usuario y contraseña');
        return;
    }
    
    // Buscar usuario
    const user = USER_DB.find(u => u.user === username && u.pass === password);
    
    if (!user) {
        showLoginMsg('Usuario o contraseña incorrectos');
        return;
    }
    
    // Login exitoso
    showLoginMsg('✓ Login exitoso. Redirigiendo...');
    
    // Guardar sesión
    sessionStorage.setItem('auth_user', user.user);
    sessionStorage.setItem('auth_role', user.role);
    sessionStorage.setItem('auth_name', user.name || user.user);
    
    // Ocultar login y mostrar app
    setTimeout(() => {
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('mainApp').style.display = 'grid';
        applyRoleUI();
    }, 1000);
}

// Aplicar UI según rol
function applyRoleUI() {
    const role = sessionStorage.getItem('auth_role');
    const dashboardTab = document.querySelector('[data-tab="dashboard"]');
    const feedbackTab = document.querySelector('[data-tab="feedback"]');
    const gestionTab = document.querySelector('[data-tab="gestion"]');
    const analisisTab = document.querySelector('[data-tab="analisis"]');
    
    // Mostrar/ocultar según rol
    if (role === 'calidad') {
        if (gestionTab) gestionTab.style.display = 'flex';
        if (dashboardTab) dashboardTab.style.display = 'none';
        if (feedbackTab) feedbackTab.style.display = 'none';
        if (analisisTab) analisisTab.style.display = 'none';
        switchTab('gestion');
    } else {
        if (gestionTab) gestionTab.style.display = 'none';
        if (dashboardTab) dashboardTab.style.display = 'flex';
        if (feedbackTab) feedbackTab.style.display = 'flex';
        if (analisisTab) analisisTab.style.display = 'flex';
        switchTab('dashboard');
    }
}

// Logout
function logout() {
    sessionStorage.clear();
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginMsg').style.display = 'none';
    document.getElementById('loginHelp').style.display = 'none';
}

// Inicializar eventos de login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay sesión
    const user = sessionStorage.getItem('auth_user');
    
    if (user) {
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('mainApp').style.display = 'grid';
        applyRoleUI();
    } else {
        document.getElementById('loginOverlay').classList.remove('hidden');
    }
    
    // Enter para login
    document.getElementById('loginPass').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
});
