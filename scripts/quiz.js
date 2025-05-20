const quizId = new URLSearchParams(window.location.search).get("id");

let preguntas = [];
let preguntaActualIndex = 0;
let puntaje = 0;
let total = 0;
let tiempoRestante = 0;
let timerInterval;

async function iniciarQuiz() {
    try {
        const quiz = await fetch(`http://13.53.35.179:8000/quizes/${quizId}`).then(res => res.json());
        preguntas = await fetch(`http://13.53.35.179:8000/preguntas/por_quiz/${quizId}`).then(res => res.json());

        const quizContainer = document.getElementById("quiz-container");
        if (!preguntas.length) {
            if (quizContainer) quizContainer.innerHTML = "<h2>No hay preguntas para este quiz</h2>";
            return;
        }

        total = preguntas.length;
        mostrarPregunta();
    } catch (error) {
        const quizContainer = document.getElementById("quiz-container");
        if (quizContainer) quizContainer.innerHTML = "<h2>Error cargando el quiz</h2>";
    }
}

async function mostrarPregunta() {
    clearInterval(timerInterval);

    const pregunta = preguntas[preguntaActualIndex];

    const respuestas = await fetch(`http://13.53.35.179:8000/respuesta/pregunta/${pregunta.id}/respuestas`)
        .then(res => res.json());

    const preguntaContainer = document.getElementById("pregunta");

    let preguntaHTML = `<h2>${pregunta.descripcion}</h2>`;

    if (pregunta.imagen) {
        const imagenRelativa = pregunta.imagen.replace(/^uploads\//, "");
        const imagenURL = `http://13.53.35.179:8000/uploads/${imagenRelativa}`;

        preguntaHTML += `<img src="${imagenURL}" alt="Imagen de la pregunta" style="max-width: 100%; height: auto; margin-top: 10px;">`;
    }

    preguntaContainer.innerHTML = preguntaHTML;

    const respuestasContainer = document.getElementById("respuestas");
    respuestasContainer.innerHTML = "";

    respuestas.forEach(respuesta => {
        const btn = document.createElement("button");
        btn.textContent = respuesta.descripcion;
        btn.className = "answer-option";
        btn.onclick = () => manejarRespuesta(respuesta.valido);
        respuestasContainer.appendChild(btn);
    });

    tiempoRestante = pregunta.tiempo || 15;
    document.getElementById("timer").textContent = `Tiempo: ${tiempoRestante}s`;
    timerInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById("timer").textContent = `Tiempo: ${tiempoRestante}s`;
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            manejarRespuesta(false);
        }
    }, 1000);
}

function manejarRespuesta(correcta) {
    clearInterval(timerInterval);
    if (correcta) puntaje += 10;

    preguntaActualIndex++;
    if (preguntaActualIndex < preguntas.length) {
        mostrarPregunta();
    } else {
        window.location.href = `resultados.html?puntaje=${puntaje}&total=${total * 10}`;
    }
}

document.addEventListener("DOMContentLoaded", iniciarQuiz);