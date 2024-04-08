import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";
import * as impAnswerBlocks from "./components/answerBlocks.js";

let timerInterval = null;

const urlParams = new URLSearchParams(window.location.search);

const testIdParam = urlParams.get("testId");

const newUrl = `${window.location.origin}${window.location.pathname}`;

window.history.replaceState({}, document.title, newUrl);

let playingTest = localStorage.getItem("isTestPlaying");

if (
  (!testIdParam && JSON.parse(playingTest) == false) ||
  (!testIdParam && !playingTest)
) {
  goMainPage();
}

let choosedTests = localStorage.getItem("choosedTests");
if (!choosedTests) {
  goMainPage();
}

choosedTests = JSON.parse(choosedTests);
if (choosedTests.length == 0) {
  goMainPage();
}

// якшо тест вже йде то відновлюємо його

resumeTest();

// якшо тест ще не йде то ставимо лісенер на початок
startTestWaiter();

function startTestWaiter() {
  let startTestButton = document.querySelector(".start-test-button");
  if (!startTestButton) {
    return console.error("Cannot find a required html component");
  }
  startTestButton.addEventListener("click", async function (e) {
    e.preventDefault();
    let { err, inputgroup, inputname } = validateForm();
    if (err > 0) {
      alert("Перевірте правильність вводу даних");
      return;
    }
    let testInfoResponse = await impHttp.getTestsById(choosedTests);
    if (testInfoResponse.status == 200) {
      let testsInfo = testInfoResponse.data;

      testsInfo.forEach((testInfo) => {
        let testQuestions = JSON.parse(testInfo.questions);
        let array = createEmptyAnswersArr(testQuestions);
        localStorage.setItem(`${testInfo.testId}`, JSON.stringify(array));
      });

      // записуємо в локалсторейдж дані про проходження
      localStorage.setItem("username", inputname);
      localStorage.setItem("usergroup", inputgroup);
      localStorage.setItem("isTestPlaying", true);
      let startTime = new Date().getTime();
      localStorage.setItem("startedAt", startTime);
      localStorage.setItem("currentTest", testsInfo[0].testId);
      createTestInterface(inputname, inputgroup);
      changeTestButton(testsInfo);
      await openTest(testsInfo[0], startTime);
      startTimer(+startTime);
    }
  });
}

// 0 - Вибір з 4",
// 1 - "Вибір з 5",
// 2 - "Відповідність 3 на 5",
// 3 - "Відповідність 4 на 4",
// 4 - "Відповідність 4 на 5",
// 5 - "Відповідність 5 на 8",
// 6 - "Введення 1",
// 7 - "Введення 2",
// 8 - "Введення 3"

function createEmptyAnswersArr(questions) {
  let array = [];
  questions.forEach((question, i) => {
    let answer = [null];
    switch (question.type) {
      case 0:
        answer = [null];
        break;
      case 1:
        answer = [null];
        break;
      case 2:
        answer = [null, null, null];
        break;
      case 3:
        answer = [null, null, null, null];
        break;
      case 4:
        answer = [null, null, null, null];
        break;
      case 5:
        answer = [null, null, null, null, null];
        break;
      case 6:
        answer = [null, null, null, null, null];
        break;
      case 7:
        answer = [null, null, null, null, null, null];
        break;
      case 8:
        answer = [null];
        break;
      case 9:
        answer = [null];
        break;
      case 10:
        answer = [null, null, null];
        break;
      default:
        break;
    }
    array.push({
      question: i,
      answer: answer,
      type: question.type,
      submitted: false,
    });
  });
  return array;
}

export function showAnsweredInNav(answers) {
  let navigation = document.querySelector(".test-page__header-navigation ");
  let navButtons = navigation.querySelectorAll(".header-navigation__item");
  navButtons.forEach((item, i) => {
    if (answers[i] && answers[i].submitted) {
      item.classList.add("passed");
    }
  });
}

function changeTestButton(testsInfo) {
  let buttonParent = document.querySelector(".header__change-test");
  let currentTestId = localStorage.getItem("currentTest");

  testsInfo.forEach((testInfo, i) => {
    let button = document.createElement("button");
    button.classList.add(
      `change-subject-button`,
      `option-${i}`,
      `${currentTestId == testInfo.testId ? "active" : "default"}`
    );
    button.setAttribute("test", testInfo.testId);
    button.innerHTML = testInfo.subjectName;
    button.addEventListener("click", async function () {
      let buttons = document.querySelectorAll(".change-subject-button");
      buttons.forEach((button) => {
        button.classList.remove("active");
      });
      button.classList.add("active");
      localStorage.setItem("currentTest", testInfo.testId);
      let answersArr = localStorage.getItem(testInfo.testId);
      if (!answersArr) {
        answersArr = null;
      }
      answersArr = JSON.parse(answersArr);
      let startTime = localStorage.getItem("startedAt");
      if (!startTime) {
        return goMainPage();
      }
      await openTest(testInfo, startTime, answersArr);
    });
    buttonParent.appendChild(button);
  });
}

function createTestInterface(username, usergroup) {
  // вставляємо дані
  let subject = document.querySelector(".test-page__header .subject");
  subject.innerHTML = "";
  let testPageHeader = document.querySelector(".test-page__header");
  testPageHeader.innerHTML += `<p class="user_name">
  Тестування проходить:
  <span class="name">${username}</span>, група
  <span class="group">${usergroup}</span>
</p>`;

  let testPageMain = document.querySelector(".test-page__main");

  testPageMain.innerHTML = ` <div class="test-wrapper">
  <div class="header__info-row">
    <div class="header__change-test">

    </div>
    <div class="header__timer">
      <span class="header__timer-time"></span>
    </div>
  </div>

  <div
    class="test-page__header-navigation header-navigation"
  ></div>
  <div class="test-page__body test-body">
    <div class="test-body__task-number"></div>
    <div class="question-block"></div>
    <div class="test-body__footer test-footer">
      <div class="test-footer__submit-wrapper"></div>
      <button class="test-footer__button test-footer__finish">
        Завершити тест
      </button>
    </div>
  </div>
</div>`;
}

function createTestNavigation(questionsArray) {
  let testPageMain = document.querySelector(".test-page__main");
  let navigation = testPageMain.querySelector(".header-navigation");
  navigation.innerHTML = "";
  questionsArray.forEach((question, i) => {
    if (!navigation) {
      return;
    }
    let menuElement = document.createElement("div");
    menuElement.classList.add("header-navigation__item");
    menuElement.setAttribute("questionNum", i);
    menuElement.innerHTML = i + 1;
    menuElement.addEventListener("click", function () {
      let questionNumber = menuElement.getAttribute("questionNum");
      openQuestion(questionsArray, questionNumber);
    });
    navigation.appendChild(menuElement);
  });
}

async function openTest(testInfo, startTime, answersArr = null) {
  // startTimer(startTime);

  let testQuestions = JSON.parse(testInfo.questions);

  // створюємо навігацію
  createTestNavigation(testQuestions);
  // відкриваємо перше питання

  openQuestion(testQuestions, 0);

  if (answersArr != null) {
    showAnsweredInNav(answersArr);
  }

  let finishTestBtn = document.querySelector(".test-footer__finish");
  finishTestBtn.addEventListener("click", async function () {
    stopTest();
  });
}

function complitAnswers() {
  let complitedAnswers = [];
  choosedTests.forEach((testId) => {
    let testAnswers = localStorage.getItem(testId);
    if (!testAnswers) {
      return alert(`відповіді до тесту ${testId} не були збережені`);
    }
    let newObject = {
      testId: testId,
      answers: testAnswers,
    };
    complitedAnswers.push(newObject);
  });
  return complitedAnswers;
}

async function stopTest() {
  let answers = complitAnswers();
  let username = localStorage.getItem("username");
  if (!username) {
    username = "Невідомий користувач";
  }
  let response = await impHttp.finishTest(answers, username);

  if (response.status == 200) {
    let resultsArr = response.data.resultsArray;
    localStorage.clear();
    let testPageMain = document.querySelector(".test-page__main");
    testPageMain.innerHTML = "";
    resultsArr.forEach((testResult) => {
      testPageMain.innerHTML += `
      <div class="test__page-result">${testResult.subjectName}: ${testResult.matchingCount}/${testResult.generalAnswers}</div>
       `;
    });

    testPageMain.innerHTML += `
    <button class="test__page-return-to-main">На головну</button>
     `;
    let button = testPageMain.querySelector(".test__page-return-to-main");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      localStorage.clear();
      location = importConfig.client_url;
    });
  } else {
    alert(
      "Помилка при автоматичній перевірці. Ваші відповіді відправлено на перевірку автору тесту"
    );
    localStorage.clear();
    location = importConfig.client_url;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}

function validateForm() {
  //const pattern =/^*^/ // /^[a-zA-Zа-яА-Я\s]+$/;
  let err = 0;
  let form = document.querySelector(".start-test-form");
  let inputname = form.querySelector("#name-input").value;
  let inputgroup = form.querySelector("#group-input").value;

  if (!inputname || !inputgroup) {
    err++;
    return { err };
  }
  //if (!pattern.test(inputname) || inputname == "" || inputname == " ") {
  if (inputname == "" || inputname == " ") {
    err++;
  }
  if (inputgroup == "" || inputgroup == " ") {
    err++;
  }

  return { err, inputgroup, inputname };
}

async function resumeTest() {
  let username = localStorage.getItem("username");
  let usergroup = localStorage.getItem("usergroup");
  let isTestPlaying = localStorage.getItem("isTestPlaying");
  let startTime = localStorage.getItem("startedAt");

  if (isTestPlaying) {
    let testInfoResponse = await impHttp.getTestsById(choosedTests);
    if (testInfoResponse.status == 200) {
      let testsInfo = testInfoResponse.data;
      testsInfo.forEach((testInfo) => {
        let answersArr = localStorage.getItem(testInfo.testId);
        if (!answersArr) {
          let testQuestions = JSON.parse(testInfo.questions);
          let array = createEmptyAnswersArr(testQuestions);
          localStorage.setItem(`${testInfo.testId}`, JSON.stringify(array));
        }
      });

      let currentTestId = localStorage.getItem("currentTest");
      if (!currentTestId) {
        localStorage.setItem("currentTest", testsInfo[0].testId);
        currentTestId = testsInfo[0].testId;
      }
      // знаходимо поточний тест в масиві
      let currentTest = testsInfo.filter((test) => {
        return test.testId == currentTestId;
      })[0];

      let answersArr = localStorage.getItem(currentTestId);
      if (!answersArr) {
        answersArr = null;
      }
      answersArr = JSON.parse(answersArr);
      createTestInterface(username, usergroup);
      changeTestButton(testsInfo);
      await openTest(currentTest, +startTime, answersArr);
      startTimer(+startTime);
    }
  }
}
// testDeadline = 2 * 60 * 60 * 1000
function startTimer(startTime, testDeadline = 2 * 60 * 60 * 1000) {
  if (!startTime) {
    alert("Тест закінчився, час початку вичерпано або його не існує");
    stopTest();
  }
  clearInterval(timerInterval);
  let endTime = startTime + testDeadline;

  timerInterval = setInterval(function () {
    let currentTime = new Date().getTime();
    let remainingTime = endTime - currentTime;

    let totalSeconds = Math.floor(remainingTime / 1000);
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60);

    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    if (remainingTime <= 900000) {
      let stopTestButton = document.querySelector(".test-footer__finish");
      stopTestButton.classList.add("visible");
    }
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      stopTest();
    }
    let timerBlock = document.querySelector(".header__timer-time");
    if (timerBlock) {
      timerBlock.innerHTML = `${minutes}:${seconds}`;
    }
  }, 500);
}
export function openQuestion(questionsArr, questionNumber) {
  let questionBlock = document.querySelector(".question-block");
  if (!questionBlock) {
    return;
  }
  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );
  let question = questionsArr[questionNumber];
  if (!question) {
    return console.error("This question not found");
  }
  submitButtonWrapper.innerHTML = "";

  // відображаємо обране питання в навігації
  let navigation = document.querySelector(".test-page__header-navigation");
  if (navigation) {
    let navButtons = document.querySelectorAll(".header-navigation__item");
    navButtons.forEach((button) => {
      button.classList.remove("active");
    });

    if (navButtons[questionNumber]) {
      navButtons[questionNumber].classList.add("active");
    }
  }

  // вставляємо питання

  let questionElement = document.createElement("div");
  questionElement.classList.add("question");
  questionElement.setAttribute("questionNumber", questionNumber);
  questionElement.innerHTML += question.body;
  questionBlock.innerHTML = "";
  let questionId = localStorage.getItem("currentTest");
  if (!questionId) {
    questionId = choosedTests[0];
  }

  let answers = createBlockByType(
    questionId,
    question.type,
    +questionNumber,
    questionsArr
  );

  showQuestionNumber(questionsArr.length, questionNumber);

  questionBlock.appendChild(questionElement);
  questionBlock.appendChild(answers);
}

function showQuestionNumber(generalQuestions, questionNumber) {
  let questionNumberBlock = document.querySelector(".test-body__task-number");
  if (questionNumberBlock) {
    questionNumberBlock.innerHTML = `Завдання <span class="currNum">${
      +questionNumber + 1
    }</span> з<span class="genNum">${generalQuestions}</span>`;
  }
}

function createBlockByType(questionId, type, questionNumber, questionsArr) {
  let answersBlock = document.createElement("div");
  answersBlock.classList.add("answers-block");
  switch (type) {
    case 0:
      answersBlock.appendChild(
        impAnswerBlocks.chooseOneAnswerOf4(
          questionId,
          questionsArr,
          questionNumber
        )
      );
      return answersBlock;
    case 1:
      answersBlock.appendChild(
        impAnswerBlocks.chooseOneAnswerOf5(
          questionId,
          questionsArr,
          questionNumber
        )
      );
      return answersBlock;
    case 2:
      answersBlock.appendChild(
        impAnswerBlocks.chooseMany3x5(questionId, questionsArr, questionNumber)
      );
      return answersBlock;
    case 3:
      answersBlock.appendChild(
        impAnswerBlocks.chooseMany4x4(questionId, questionsArr, questionNumber)
      );
      return answersBlock;
    case 4:
      answersBlock.appendChild(
        impAnswerBlocks.chooseMany4x5(questionId, questionsArr, questionNumber)
      );
      return answersBlock;
    case 5:
      answersBlock.appendChild(
        impAnswerBlocks.chooseMany5x4(
          questionId,
          questionsArr,
          questionNumber,
          "eng"
        )
      );
      return answersBlock;
    case 6:
      answersBlock.appendChild(
        impAnswerBlocks.chooseMany5x8(
          questionId,
          questionsArr,
          questionNumber,
          "eng"
        )
      );
      return answersBlock;
    case 7:
      answersBlock.appendChild(
        impAnswerBlocks.chooseMany6x8(
          questionId,
          questionsArr,
          questionNumber,
          "eng"
        )
      );
      return answersBlock;
    case 8:
      answersBlock.appendChild(
        impAnswerBlocks.enter1digit(questionId, questionsArr, questionNumber)
      );
      return answersBlock;
    case 9:
      answersBlock.appendChild(
        impAnswerBlocks.enter2digits(questionId, questionsArr, questionNumber)
      );
      return answersBlock;
    case 10:
      answersBlock.appendChild(
        impAnswerBlocks.enter3digits(questionId, questionsArr, questionNumber)
      );
      return answersBlock;
    case 11:
      answersBlock.appendChild(
        impAnswerBlocks.chooseOneAnswerOf4(
          questionId,
          questionsArr,
          questionNumber,
          "eng"
        )
      );
      return answersBlock;
    case 12:
      answersBlock.appendChild(
        impAnswerBlocks.chooseOneAnswerOf8(
          questionId,
          questionsArr,
          questionNumber,
          "eng"
        )
      );
      return answersBlock;
    default:
      return answersBlock;
  }
}

function goMainPage() {
  location = importConfig.client_url;
  window.history.replaceState({}, document.title, importConfig.client_url);
  stopTest();
}

// 0 - "Вибір з 4",
// 1 - "Вибір з 5",
// 2 - "Відповідність 3 на 5",
// 3 - "Відповідність 4 на 4",
// 4 - "Відповідність 4 на 5",
// 5 - "Відповідність 5 на 8",
// 6 - "Введення 1",
// 7 - "Введення 2",
// 8 - "Введення 3"
