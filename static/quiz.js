// ======================================================
// QUESTIONS
// ======================================================
const questions = [
{
question:"What organization was created by the United States in 1958 in response to Sputnik?",
choices:["NSF","ARPA","CERN","W3C"],
answer:1,
explanation:"1958: The US created the Advanced Research Projects Agency (ARPA) as a response to Sputnik."
},
{
question:"Who developed the concept of packet switching in 1961?",
choices:["Ray Tomlinson","Vint Cerf","Leonard Kleinrock","Tim Berners-Lee"],
answer:2,
explanation:"1961: Leonard Kleinrock published his work on packet-switching networks, which provided an important theoretical foundation for computer communication."
},
{
question:"What major development occurred in 1984?",
choices:["TCP was split into TCP and IP", "DNS was introduced", "NSFNET was established", "ARPANET was shut down"],
answer:1,
explanation:"1984: DNS was introduced, to translate human-readable names into network addresses."
},
{
question:"What happened in 1986?",
choices:["The Web was proposed", "The National Science Foundation established NSFNET", "Email was introduced", "Google was founded"],
answer:1,
explanation:"1986: The National Science Foundation (NSF) established NSFNET, an academic network."
},
{
question:"What happened in 1990 according to the Internet history timeline?",
choices:["NSFNET was established","ARPANET was shut down","The World Wide Web was proposed","Google was founded"],
answer:1,
explanation:"1990: ARPANET was shut down"
},
{
question:"Who proposed the World Wide Web in 1989?",
choices:["Vannevar Bush", "Tim Berners-Lee", "Ray Tomlinson", "Leonard Kleinrock"],
answer:1,
explanation:"1989: The World Wide Web was proposed by Berners-Lee as a global hypertext system for sharing information among researchers at CERN."
},
{
question:"What did Tim Berners-Lee develop in 1990?",
choices:["The first web server, web browser/editor, HTML, HTTP, and URL system","The first search engine","TCP/IP","NSFNET"],
answer:0,
explanation:"1990: Berners-Lee developed the first web server, web browser/editor, HTML, HTTP, and URL system. The basic architecture of Web was established."
},
{
question:"What happened in 1993 that helped the Web spread rapidly?",
choices:["Google was founded", "JavaScript was introduced", "CERN removed licensing barriers", "W3C was founded"],
answer:2,
explanation:"1993: CERN removed licensing barriers. This helped the Web to spread rapidly and encouraged organizations worldwide to adopt it."
},
{
question:"What happened when Web 2.0 appeared in the early 2000s?",
choices:["The Web became limited to research institutions","Websites became mostly static","The Web evolved from mostly static pages toward interactive services and user-generated content","DNS was replaced by HTML"],
answer:2,
explanation:"Early 2000s: Web 2.0 appeared. The Web evolved from mostly static pages toward interactive services and user-generated content."
},
{
question:"What happened in 1998 according to the Web history timeline?",
choices:["JavaScript was introduced","Google was founded","W3C was founded","Mosaic browser was released"],
answer:1,
explanation:"1998: Google was founded."
}
]
 // Populate this array with question objects as needed.
// Each question object should have the following structure:
//   {
//     question:
//       "Which keyword declares a block-scoped variable that can later be reassigned?",
//     choices: ["var", "let", "const", "static"],
//     answer: 1,
//     explanation:
//       "let declares a block-scoped variable whose value may later be reassigned.",
//   },


// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

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
  if(currentQuestion<questions.length-1)
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
  currentQuestion=questions.length-1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score=0;
  for (let x in userAnswers)
  { if(userAnswers[x]===questions[x].answer)
      {score++;}
  }
  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  let percentage=(score/(questions.length))*100;
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
function buildCorrection() {
let correction = "";

  for (let x = 0; x < questions.length; x++) {
    correction += "Question " + (x + 1) + ": " + questions[x].question + "\n\n";

    if (userAnswers[x] !== undefined) {
      correction += "Your answer: " + questions[x].choices[userAnswers[x]] + "\n";
    } else {
      correction += "Your answer: No answer\n";
    }

    correction += "Correct answer: " + questions[x].choices[questions[x].answer] + "\n";

    if (userAnswers[x] === questions[x].answer) {
      correction += "Result: Correct\n";
    } else {
      correction += "Result: Incorrect\n";
    }

    correction += "Explanation: " + questions[x].explanation + "\n\n";
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
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
