// Array de perguntas (apenas as primeiras 5 para exemplo)
const questions = [
    {
        question: "Qual é o principal benefício da computação em nuvem em termos de despesas de capital (CapEx)?",
        options: [
            "A) Aumenta significativamente os custos iniciais de infraestrutura",
            "B) Converte despesas de capital em despesas operacionais",
            "C) Requer investimento antecipado em hardware físico",
            "D) Elimina completamente todos os custos operacionais"
        ],
        correct: 1,
        explanation: "A computação em nuvem permite converter CapEx (despesas de capital) em OpEx (despesas operacionais), eliminando a necessidade de grandes investimentos iniciais em infraestrutura."
    },
    {
        question: "Qual serviço AWS é usado para armazenamento de objetos?",
        options: [
            "A) Amazon EBS",
            "B) Amazon S3",
            "C) Amazon RDS",
            "D) Amazon DynamoDB"
        ],
        correct: 1,
        explanation: "Amazon S3 (Simple Storage Service) é o serviço de armazenamento de objetos da AWS, oferecendo durabilidade, disponibilidade e escalabilidade."
    },
    {
        question: "Qual é o modelo de responsabilidade compartilhada na AWS?",
        options: [
            "A) AWS é responsável por tudo, incluindo os dados do cliente",
            "B) O cliente é responsável por toda a infraestrutura física",
            "C) AWS cuida da segurança 'da' nuvem, cliente cuida da segurança 'na' nuvem",
            "D) Apenas o cliente é responsável pela segurança"
        ],
        correct: 2,
        explanation: "No modelo de responsabilidade compartilhada, a AWS é responsável pela segurança DA nuvem (infraestrutura), enquanto o cliente é responsável pela segurança NA nuvem (dados, aplicações, configurações)."
    },
    {
        question: "Qual serviço AWS fornece computação serverless?",
        options: [
            "A) Amazon EC2",
            "B) Amazon Lambda",
            "C) Amazon ECS",
            "D) Amazon EKS"
        ],
        correct: 1,
        explanation: "Amazon Lambda é o serviço de computação serverless da AWS que executa código sem a necessidade de provisionar ou gerenciar servidores."
    },
    {
        question: "O que significa RPO (Recovery Point Objective)?",
        options: [
            "A) Tempo máximo aceitável para restaurar um sistema",
            "B) Quantidade máxima de dados que pode ser perdida",
            "C) Número de backups necessários",
            "D) Frequência de teste de recuperação"
        ],
        correct: 1,
        explanation: "RPO (Recovery Point Objective) define a quantidade máxima de dados que uma organização pode perder durante um incidente, medida em tempo."
    }
];

// Variáveis globais
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 90 * 60; // 90 minutos em segundos
let userAnswers = new Array(questions.length).fill(null);

// Inicialização do quiz
function initQuiz() {
    document.getElementById('total-questions').textContent = questions.length;
    updateTimerDisplay();
    startTimer();
    showQuestion();
}

// Mostrar questão atual
function showQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const question = questions[currentQuestion];
    
    quizContainer.innerHTML = `
        <div class="question-container active">
            <div class="question-number">Questão ${currentQuestion + 1}</div>
            <div class="question-text">${question.question}</div>
            <ul class="options">
                ${question.options.map((option, index) => `
                    <li class="option ${userAnswers[currentQuestion] === index ? 'selected' : ''} 
                        ${userAnswers[currentQuestion] !== null && index === question.correct ? 'correct' : ''}
                        ${userAnswers[currentQuestion] !== null && userAnswers[currentQuestion] === index && userAnswers[currentQuestion] !== question.correct ? 'incorrect' : ''}">
                        <input type="radio" id="option-${index}" name="option" value="${index}" 
                            ${userAnswers[currentQuestion] === index ? 'checked' : ''}
                            ${userAnswers[currentQuestion] !== null ? 'disabled' : ''}>
                        <label for="option-${index}">${option}</label>
                    </li>
                `).join('')}
            </ul>
            
            ${userAnswers[currentQuestion] !== null ? `
                <div class="explanation">
                    <h4>Explicação:</h4>
                    <p>${question.explanation}</p>
                </div>
            ` : ''}
            
            <div class="navigation">
                <button class="btn btn-secondary" onclick="prevQuestion()" ${currentQuestion === 0 ? 'disabled' : ''}>Anterior</button>
                <button class="btn btn-primary" onclick="nextQuestion()">${currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}</button>
            </div>
        </div>
    `;
    
    document.getElementById('current-question').textContent = currentQuestion + 1;
    updateProgress();
}

// Próxima questão
function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    
    if (selectedOption) {
        userAnswers[currentQuestion] = parseInt(selectedOption.value);
        
        if (userAnswers[currentQuestion] === questions[currentQuestion].correct) {
            score++;
            document.getElementById('score').textContent = score;
        }
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

// Questão anterior
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

// Atualizar barra de progresso
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

// Temporizador
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Finalizar quiz
function finishQuiz() {
    clearInterval(timer);
    
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results');
    const finalScore = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    finalScore.textContent = `${score}/${questions.length}`;
    
    const percentage = (score / questions.length) * 100;
    if (percentage >= 70) {
        resultMessage.textContent = "Parabéns! Você atingiu a pontuação necessária para a certificação AWS Cloud Practitioner.";
    } else {
        resultMessage.textContent = "Continue estudando! Você ainda não atingiu a pontuação necessária. Recomendamos revisar os conceitos básicos da AWS.";
    }
}

// Reiniciar quiz
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 90 * 60;
    userAnswers = new Array(questions.length).fill(null);
    
    document.getElementById('score').textContent = '0';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    startTimer();
    showQuestion();
}

// Iniciar o quiz quando a página carregar
window.onload = initQuiz;