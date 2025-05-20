document.addEventListener('DOMContentLoaded', function() {
    const userData = getUserCookie();
    
    if (!userData) {
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('user-name').textContent = userData.nombre;
    document.getElementById('user-email').textContent = userData.mail;

    const avatarImg = document.getElementById('profile-avatar');
    avatarImg.src = userData.avatar;
    avatarImg.alt = `Avatar de ${userData.nombre}`;
});