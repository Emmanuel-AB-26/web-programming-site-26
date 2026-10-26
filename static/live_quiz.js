
// ======================================================
// QUESTIONS
// ======================================================
let total = 0;// how many questions (from the server) 
const cache = {};     


async function getQuestion(i) {
  if (cache[i]) return cache[i];
  try {
    const response = await fetch(`/api/question/${i}`);
    if (!response.ok) throw new Error("HTTP " + response.status);
    cache[i] = await response.json();
    return cache[i];
  } catch (error) {
    console.log("Could not load question:", error.message);
    throw error;
  }
}


// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = [];  // the length isn't known until you fetch the count

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
userAnswers[currentQuestion]=choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  //   Move to the next question if not at the last question.
  if(currentQuestion<total-1)
    {currentQuestion++;}
  renderQuestion();
}

function goPrevious() {
  //   Move to the previous question if not at the first question.
  if(currentQuestion>0)
    {currentQuestion--;}
  renderQuestion();
}

function goFirst() {
  //   Move to the first question.
  currentQuestion=0;
  renderQuestion();
}
function goLast() {
  //   Move to the last question.
  currentQuestion=total-1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score=0;
  for (let x in userAnswers)
  { if(userAnswers[x]===(await getQuestion(x)).answer)
      {score++;}
  }
  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  let percentage=(score/(total))*100;
  return Math.round(percentage);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  let message="";
  if(percentage<50)
  {message="Needs Improvement";}
  else if(percentage>=50 && percentage<=59)
  {message="Pass";}
  else if(percentage>=60 && percentage<=79)
  {message="Good";}
  else if(percentage>=80 && percentage<=100)
  {message="Excellent";}
  return message;
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
let correction = "";
  for (let x = 0; x < total; x++) {
    const q = await getQuestion(x);
    correction += "Question " + (x + 1) + ": " + q.question + "\n\n";

    if (userAnswers[x] !== undefined) {
      correction += "Your answer: " + q.choices[userAnswers[x]] + "\n";
    } else {
      correction += "Your answer: No answer\n";
    }

    correction += "Correct answer: " + q.choices[q.answer] + "\n";

    if (userAnswers[x] === (q.answer)) {
      correction += "Result: Correct\n";
    } else {
      correction += "Result: Incorrect\n";
    }

    correction += "Explanation: " + q.explanation + "\n\n";
  }

  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
}


async function renderQuestion() {
  const error=document.getElementById('error');
  const loading=document.getElementById('loading');
  error.hidden = true;
  loading.hidden = false;

  try {
    const q = await getQuestion(currentQuestion);
    // QUESTION NUMBER
    document.getElementById("progress").textContent =
      `Question ${currentQuestion + 1} of ${total}`;

    // QUESTION
    document.getElementById("questionText").textContent = q.question;

    // CHOICES
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    for (let i = 0; i < q.choices.length; i++) {
      const label = document.createElement("label");
      label.className = "choice";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = i;

      // Restore a previously selected answer
      if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
      }

      // Save the selected answer
      radio.onclick = function () {
        saveAnswer(i);
      };

      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + q.choices[i]));
      choicesContainer.appendChild(label);
    }

    // NAVIGATION BUTTONS
    document.getElementById("firstBtn").disabled =
      currentQuestion === 0;

    document.getElementById("previousBtn").disabled =
      currentQuestion === 0;

    document.getElementById("nextBtn").disabled =
      currentQuestion === total - 1;

    document.getElementById("lastBtn").disabled =
      currentQuestion === total - 1;

  } catch (err) {
    error.hidden = false;
    error.textContent = "An error has occurred.";
    console.error(err);
  } finally {
    loading.hidden = true;
  }
}


// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
async function init() {
  try {
    const response = await fetch("/api/questions/count");

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();
    total = data.count;

    userAnswers.length = total;

    await renderQuestion();
  } catch (error) {
    const loading = document.getElementById("loading");
    const errorElement = document.getElementById("error");

    loading.hidden = true;
    errorElement.hidden = false;
    errorElement.textContent = "Could not load the quiz.";
    console.error("Could not initialize the quiz:", error);
  }
}

init();