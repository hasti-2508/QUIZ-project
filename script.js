const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];

// Function to initialize the quiz
async function initializeQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = 'Score: ' + score;

    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
        const data = await response.json();
        quizQuestions = data.results;

        displayQuestion();
    } catch (error) {
        console.log('Error fetching quiz questions:', error);
    }
}

// Function to display a question and its options
function displayQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    optionsContainer.innerHTML = '';
    const allOptions = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
    const shuffledOptions = shuffleArray(allOptions);

    shuffledOptions.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option');
        optionButton.innerHTML = option;
        optionButton.addEventListener('click', checkAnswer);
        optionsContainer.appendChild(optionButton);
    });
}

// Function to shuffle the options array
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Function to check the selected answer
function checkAnswer(event) {
    const selectedOption = event.target;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedOption.innerHTML === correctAnswer) {
        score++;
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('wrong');
    }

    scoreElement.innerText = 'Score: ' + score;

    // Disable options after selection
    optionsContainer.querySelectorAll('.option').forEach(option => {
        option.disabled = true;
        if (option.innerHTML === correctAnswer) {
            option.classList.add('correct');
        }
    });

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        setTimeout(() => {
            resetOptions();
            displayQuestion();
        }, 1500); // Delay for 1.5 seconds before displaying the next question
    } else {
        setTimeout(endQuiz, 1500); // Delay for 1.5 seconds before ending the quiz
    }
}

// Function to reset option styles
function resetOptions() {
    optionsContainer.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'wrong');
        option.disabled = false;
    });
}

// Function to end the quiz
function endQuiz() {
    quizContainer.innerHTML = '<h2 style="background-color: #2196F3; color: black; size: 80px;">Quiz Completed!</h2><p style="background-color: #2196F3; color: black;">Your final score is: ' + score + '</p>';
}


// Initialize the quiz
initializeQuiz();
