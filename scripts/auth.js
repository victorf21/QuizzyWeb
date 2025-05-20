document.addEventListener('DOMContentLoaded', function () {
    // Login
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const buttonText = document.getElementById('button-text');
    const errorElement = document.getElementById('login-error');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        submitBtn.disabled = true;
        const originalText = buttonText.textContent;
        buttonText.textContent = 'Iniciando sesión...';
        errorElement.textContent = '';
        errorElement.style.display = 'none';

        try {
            const response = await fetch('http://13.53.35.179:8000/usuarios/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    mail: emailInput.value,
                    password: passwordInput.value
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Error en el inicio de sesión');
            }

            if (data.success && data.usuario) {
                // Guardar en cookie
                setUserCookie({
                    id: data.usuario.id,
                    mail: data.usuario.mail,
                    nombre: data.usuario.nombre,
                    avatar: data.usuario.avatar || '/images/default-avatar.jpg',
                    tipo: data.usuario.tipo,
                    
                });

                // Redirigir
                if (data.usuario.tipo === 'alumne') {
                    window.location.href = 'quizzes.html';
                } else if (data.usuario.tipo === 'profesor') {
                    window.location.href = 'professor.html';
                }
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }

        } catch (error) {
            console.error('Error de login:', error);
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            buttonText.textContent = originalText;
        }
    });

    // Registro

    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    const registerBtn = document.getElementById('register-btn');
    const registerText = document.getElementById('register-text');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        registerBtn.disabled = true;
        const originalText = registerText.textContent;
        registerText.textContent = 'Registrando...';
        registerError.textContent = '';
        registerError.style.display = 'none';

        const nombre = document.getElementById('register-name').value;
        const mail = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const edad = parseInt(document.getElementById('register-age').value) || null;
        const tipo = document.getElementById('register-type').value || null;

        try {
            const response = await fetch('http://13.53.35.179:8000/usuarios/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    mail,
                    password,
                    edad,
                    tipo
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Error al registrarse');
            }

            alert("Usuario creado correctamente");
            registerForm.reset();

        } catch (error) {
            console.error('Error en el registro:', error);
            registerError.textContent = error.message;
            registerError.style.display = 'block';
        } finally {
            registerBtn.disabled = false;
            registerText.textContent = originalText;
        }
    });

});
