document.addEventListener('DOMContentLoaded', async () => {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const categoriaSeleccionada = getQueryParam('categoria');

    const quizzesContainer = document.getElementById('quizzes-list');

    if (!categoriaSeleccionada) {
        quizzesContainer.innerHTML = '<p>No se ha seleccionado ninguna categoría.</p>';
        return;
    }

    try {
        const response = await fetch('http://13.53.35.179:8000/quizes/');

        if (!response.ok) {
            throw new Error('Error al cargar los quizzes');
        }

        const quizzes = await response.json();

        const quizzesFiltrados = quizzes.filter(q => q.categorias && q.categorias.trim().toLowerCase() === categoriaSeleccionada.toLowerCase());

        if (quizzesFiltrados.length === 0) {
            quizzesContainer.innerHTML = `<p>No hay quizzes disponibles para la categoría "${categoriaSeleccionada}".</p>`;
            return;
        }

        quizzesContainer.innerHTML = '';

        quizzesFiltrados.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';

            quizCard.innerHTML = `
                <div class="quiz-image" style="background-image: url('${quiz.imagen || '/images/quiz-default.jpg'}')"></div>
                <div class="quiz-info">
                    <h3 class="quiz-title">${quiz.nombre}</h3>
                    <div class="quiz-meta">
                        <span>${quiz.categorias}</span>
                        <span>${quiz.num_total_preguntas || '?'} preguntas</span>
                    </div>
                </div>
            `;

            quizCard.addEventListener('click', () => {
                window.location.href = `quiz.html?id=${quiz.id}`;
            });

            quizzesContainer.appendChild(quizCard);
        });

    } catch (error) {
        quizzesContainer.innerHTML = `<p>Error al cargar los quizzes: ${error.message}</p>`;
    }
});
