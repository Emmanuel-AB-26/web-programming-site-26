
// ======================================================
// QUESTIONS
// ======================================================
let total = 0;// how many questions (from the server) 
const cache = {};     

// ======================================================
// LOADING / ERROR STATES (Week 12)
// ======================================================
const quizEl = document.getElementById("quiz");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorTextEl = document.getElementById("errorText");
const retryBtn = document.getElementById("retryBtn");
let retryAction = null;     // what "Try again" should re-run
let loadingTimer = null;

// LOADING: mark the quiz busy (quiz.css dims the controls). The "Loading…"
// message only appears if the request takes longer than 150ms, so cached
// questions don't make it flash on every click.
function setBusy(isBusy) {
  clearTimeout(loadingTimer);
  if (isBusy) {
    quizEl.setAttribute("aria-busy", "true");
    loadingTimer = setTimeout(function () { loadingEl.hidden = false; }, 150);
  } else {
    quizEl.removeAttribute("aria-busy");
    loadingEl.hidden = true;
  }
}

// ERROR: show a clear message and a "Try again" button that re-runs
// whatever failed
function showError(message, retry) {
  errorTextEl.textContent = message;
  retryAction = retry;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.hidden = true;
  errorTextEl.textContent = "";
}

retryBtn.addEventListener("click", function () {
  clearError();
  if (retryAction) retryAction();
});


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
  const submitBtn = document.getElementById("submitBtn");
  // LOADING: unanswered questions may still need fetching for the correction
  clearError();
  submitBtn.setAttribute("aria-busy", "true");
  submitBtn.disabled = true;
  submitBtn.textContent = "Checking answers…";
  try {
    const score = await calculateScore();
    const percentage = calculatePercentage(score);
    const message = getPerformanceMessage(percentage);
    const correction = await buildCorrection();
    showResults(score, percentage, message, correction);
  } catch (err) {
    console.error(err);
    showError("Could not check your answers. Check your connection and try again.", submitQuiz);
  } finally {
    submitBtn.removeAttribute("aria-busy");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Quiz";
  }
}


let renderCount = 0;   // lets a slow, older request be ignored

async function renderQuestion() {
  const thisRender = ++renderCount;
  const focusedBtn = document.activeElement;
  clearError();
  setBusy(true);

  try {
    const q = await getQuestion(currentQuestion);
    // The user clicked again while this was loading: a newer render wins
    if (thisRender !== renderCount) return;
    document.getElementById("questionText").hidden = false;
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

    document.getElementById("submitBtn").disabled = false;

    // If the button the user pressed just became disabled (e.g. "Last"),
    // keep keyboard focus on the page by moving it to the new question
    if (focusedBtn && focusedBtn.tagName === "BUTTON" && focusedBtn.disabled) {
      document.getElementById("questionText").focus();
    }

  } catch (err) {
    if (thisRender !== renderCount) return;
    console.error(err);
    // Don't leave the previous question's choices clickable: an answer
    // would be saved against the question that failed to load
    document.getElementById("progress").textContent =
      `Question ${currentQuestion + 1} of ${total}`;
    document.getElementById("questionText").textContent = "";
    document.getElementById("questionText").hidden = true;   // no endless skeleton
    document.getElementById("choices").innerHTML = "";
    showError("Could not load question " + (currentQuestion + 1) +
              ". Check your connection and try again.", renderQuestion);
  } finally {
    if (thisRender === renderCount) setBusy(false);
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
  // SUCCESS / ERROR state: green for a pass (50% or more), red below that
  const performance = document.getElementById("performanceText");
  performance.className = "status " + (percentage >= 50 ? "is-success" : "is-error");
  performance.textContent = message;

  document.getElementById("correction").textContent = correction;

  // The quiz panel just disappeared: move focus to the results heading
  document.getElementById("resultsTitle").focus();
}

// ======================================================
// START APPLICATION
// ======================================================
async function init() {
  setBusy(true);
  try {
    const response = await fetch("/api/questions/count");

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();
    total = data.count;

    if (total === 0) {
      setBusy(false);
      document.getElementById("questionText").hidden = true;
      showError("No questions are available yet. Please check back later.", init);
      return;
    }

    userAnswers.length = total;

    await renderQuestion();
  } catch (error) {
    setBusy(false);
    document.getElementById("questionText").hidden = true;
    showError("Could not load the quiz. Check your connection and try again.", function () {
      document.getElementById("questionText").hidden = false;   // skeleton again
      init();
    });
    console.error("Could not initialize the quiz:", error);
  }
}

init();