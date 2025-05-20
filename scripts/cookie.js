// Guardar datos del usuario en una cookie
function setUserCookie(userData, days = 1) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const userDataJSON = encodeURIComponent(JSON.stringify(userData));
    
    let cookie = `user_data=${userDataJSON};${expires};path=/;`;
    
    if (window.location.protocol === 'https:') {
        cookie += 'Secure;';
    }
    cookie += 'SameSite=Lax';
    
    document.cookie = cookie;
}

// Obtener datos del usuario desde la cookie
function getUserCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'user_data') {
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch (e) {
                console.error('Error parsing user cookie:', e);
                return null;
            }
        }
    }
    return null;
}

// Eliminar la cookie de usuario
function deleteUserCookie() {
    document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}