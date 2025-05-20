document.addEventListener('DOMContentLoaded', function() {
    const header = document.createElement('header');
    header.className = 'app-header';

    const user = getUserCookie();

    if (user && user.tipo === 'alumne') {
        let avatarURL = '/images/default-avatar.png';
        if (user.avatar) {
            if (user.avatar.startsWith('uploads/')) {
                const imagenRelativa = user.avatar.replace(/^uploads\//, '');
                avatarURL = `http://13.53.35.179:8000/uploads/${imagenRelativa}`;
            } else {
                avatarURL = user.avatar; 
            }
        }

        header.innerHTML = `
            <nav class="nav-container">
                <div class="nav-left">
                    <img src="/img/quizzy-logo.png" alt="Logo" class="app-logo">
                </div>
                <ul class="nav-right">
                    <li>
                        <a href="profile.html">
                            <img src="${avatarURL}" alt="Avatar" class="user-avatar" id="user-avatar">
                        </a>
                    </li>
                    <li><button id="logout-btn">Cerrar sesión</button></li>
                </ul>
            </nav>
        `;

        document.body.prepend(header);

        document.getElementById('logout-btn').addEventListener('click', function () {
            deleteUserCookie();
            window.location.href = 'auth.html';
        });

    } else {
        // Si no es un alumne, redirigir al login
        window.location.href = 'auth.html';
    }

    function mostrarCategoriasRecomendadas(quizzes) {
        const categoriaSet = new Set();

        quizzes.forEach(quiz => {
            if (quiz.categorias) {
                categoriaSet.add(quiz.categorias.trim());
            }
        });

        const recommendedList = document.querySelector('.recommended-list');
        recommendedList.innerHTML = '';

        const categoriasUnicas = Array.from(categoriaSet).slice(0, 3);

        if (categoriasUnicas.length === 0) {
            recommendedList.innerHTML = '<li>No hay categorías</li>';
            return;
        }

        categoriasUnicas.forEach(categoria => {
            const li = document.createElement('li');
            li.textContent = categoria;
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
                window.location.href = `quizzestema.html?categoria=${encodeURIComponent(categoria)}`;
            });
            recommendedList.appendChild(li);
        });
    }

    const quizzesContainer = document.getElementById('quizzes-list');

    // Función para cargar los quizzes
    async function loadQuizzes() {
        try {
            const response = await fetch('http://13.53.35.179:8000/quizes/');
            
            if (!response.ok) {
                throw new Error('Error al cargar los quizzes');
            }
            
            const quizzes = await response.json();
            
            if (quizzes.length === 0) {
                quizzesContainer.innerHTML = '<div class="no-quizzes">No hay quizzes disponibles</div>';
                return;
            }
            
            // Limpiar contenedor
            quizzesContainer.innerHTML = '';
            //Mostrar categorias Recomendadas
            mostrarCategoriasRecomendadas(quizzes);
            // Crear tarjetas para cada quiz
            quizzes.forEach(quiz => {
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                
                quizCard.innerHTML = `
                    <div class="quiz-image" style="background-image: url('${quiz.imagen || '/images/quiz-default.jpg'}')"></div>
                    <div class="quiz-info">
                        <h3 class="quiz-title">${quiz.nombre}</h3>
                        <div class="quiz-meta">
                            <span>${quiz.categorias || 'General'}</span>
                            <span>${quiz.num_total_preguntas || '?'} preguntas</span>
                        </div>
                    </div>
                `;
                
                // Añadir evento click al card
                quizCard.addEventListener('click', () => {
                    window.location.href = `quiz.html?id=${quiz.id}`;
                });
                
                quizzesContainer.appendChild(quizCard);
            });
            
        } catch (error) {
            console.error('Error:', error);
            quizzesContainer.innerHTML = `
                <div class="error-message">
                    Error al cargar los quizzes: ${error.message}
                </div>
            `;
        }
    }

    // Cargar los quizzes al iniciar la página
    loadQuizzes();
});
