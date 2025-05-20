document.addEventListener('DOMContentLoaded', () => {
  const user = getUserCookie();

  if (!user) {
    window.location.href = 'auth.html';
    return;
  }
  
  const header = document.getElementById('header');
  const avatarURL = user.avatar
    ? (user.avatar.startsWith('uploads/')
      ? `http://13.53.35.179:8000/${user.avatar}`
      : user.avatar)
    : 'avatar_placeholder.png';

        header.innerHTML = `
            <nav class="nav-container">
            <div class="nav-left">
                <img src="/img/quizzy-logo.png" alt="Logo" class="app-logo" />
            </div>
            <ul class="nav-right">
                <li>
                <a href="profile.html">
                    <img src="${avatarURL}" alt="Avatar" class="user-avatar" id="user-avatar" />
                </a>
                </li>
                <li><button id="logout-btn">Cerrar sesión</button></li>
            </ul>
            </nav>
        `;

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    deleteUserCookie();
    window.location.href = 'auth.html';
  });

  document.getElementById('profile-name').textContent = user.nombre || 'Nombre no disponible';
  document.getElementById('profile-email').textContent = user.mail || 'Email no disponible';
  document.getElementById('profile-type').textContent = user.tipo || 'Desconocido';
  document.getElementById('profile-category').textContent = user.categoria || 'No disponible';
  document.getElementById('profile-points').textContent = user.pts_x_quiz ?? '0';

  const avatarImg = document.getElementById('profile-avatar');
  avatarImg.src = avatarURL;
});