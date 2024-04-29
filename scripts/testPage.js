import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";
import * as impAnswerBlocks from "./components/answerBlocks.js";
import * as impSecurity from "./dev/security.js";
import * as impSubject200 from "./convert200.js";
import { client_url } from "./dev/config.js";

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

userLogin();

async function userLogin() {
  let authResponse = await impHttp.isAuth();

  if (authResponse.status == 200) {
    let profileInfo = authResponse.data;

    // якшо тест вже йде то відновлюємо його
    let nameArr = profileInfo.name.split(" ");
    let name = nameArr[0] + " " + nameArr[1];

    resumeTest();

    // якшо тест ще не йде то ставимо лісенер на початок
    startTestWaiter();
  } else {
    location.href = client_url;
  }
}

// function startTestWaiter() {
//   let startTestButton = document.querySelector(".start-test-button");
//   if (!startTestButton) {
//     return console.error("Cannot find a required html component");
//   }
//   startTestButton.addEventListener("click", async function (e) {
//     e.preventDefault();
//     let { err, inputgroup, inputname } = validateForm();
//     if (err > 0) {
//       alert("Перевірте правильність вводу даних");
//       return;
//     }
//     let testInfoResponse = await impHttp.getTestsById(choosedTests);
//     if (testInfoResponse.status == 200) {
//       let testsInfo = testInfoResponse.data;

//       testsInfo.forEach((testInfo) => {
//         let testQuestions = JSON.parse(testInfo.questions);
//         let array = createEmptyAnswersArr(testQuestions);
//         localStorage.setItem(`${testInfo.testId}`, JSON.stringify(array));
//       });

//       // записуємо в локалсторейдж дані про проходження
//       localStorage.setItem("username", inputname);
//       localStorage.setItem("usergroup", inputgroup);
//       localStorage.setItem("isTestPlaying", true);
//       let startTime = new Date().getTime();
//       let testLength = localStorage.getItem("testLength");
//       localStorage.setItem("startedAt", startTime);
//       localStorage.setItem("currentTest", testsInfo[0].testId);
//       createTestInterface(inputname, inputgroup);
//       changeTestButton(testsInfo);
//       await openTest(testsInfo[0]);
//       startTimer(+startTime, +testLength);
//     }
//   });
// }

// 0 - Вибір з 4",
// 1 - "Вибір з 5",
// 2 - "Відповідність 3 на 5",
// 3 - "Відповідність 4 на 4",
// 4 - "Відповідність 4 на 5",
// 5 - "Відповідність 5 на 8",
// 6 - "Введення 1",
// 7 - "Введення 2",
// 8 - "Введення 3"

function startTestWaiter() {
  let startTestButton = document.querySelector(".start-test-button");
  if (!startTestButton) {
    return console.error("Cannot find a required html component");
  }

  let usergroupBlock = document.querySelector(".user-group");
  let usernameBlock = document.querySelector(".user-name");

  if (usergroupBlock) {
    usergroupBlock.innerHTML = window.group;
  }
  if (usernameBlock) {
    usernameBlock.innerHTML = window.name;
  }

  startTestButton.addEventListener("click", async function (e) {
    e.preventDefault();

    let testInfoResponse = await impHttp.getTestsById(choosedTests);
    if (testInfoResponse.status == 200) {
      let testsInfo = testInfoResponse.data;

      testsInfo.forEach((testInfo) => {
        let testQuestions = JSON.parse(testInfo.questions);
        let array = createEmptyAnswersArr(testQuestions);
        localStorage.setItem(`${testInfo.testId}`, JSON.stringify(array));
      });

      // записуємо в локалсторейдж дані про проходження
      localStorage.setItem("username", window.name);
      localStorage.setItem("usergroup", window.group);
      localStorage.setItem("isTestPlaying", true);
      let startTime = new Date().getTime();
      let testLength = localStorage.getItem("testLength");
      localStorage.setItem("startedAt", startTime);
      localStorage.setItem("currentTest", testsInfo[0].testId);
      createTestInterface(window.name, window.group);
      changeTestButton(testsInfo);
      await openTest(testsInfo[0]);
      startTimer(+startTime, +testLength);
    }
  });
}

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
      await openTest(testInfo, answersArr);
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
    
      <img src="img/timer.png" alt="" class="header__img" />   

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
  alertPopupFunctions();
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

async function openTest(testInfo, answersArr = null) {
  let testQuestions = JSON.parse(testInfo.questions);

  // створюємо навігацію
  createTestNavigation(testQuestions);
  // відкриваємо перше питання

  openQuestion(testQuestions, 0);

  if (answersArr != null) {
    showAnsweredInNav(answersArr);
  }

  let finishTestBtn = document.querySelector(".test-footer__finish");
  finishTestBtn.removeEventListener("click", stopTest);
  finishTestBtn.addEventListener("click", stopTest);
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
  let username = window.name;
  let userId = window.userId;
  if (!username) {
    username = "Невідомий користувач";
  }
  let response = await impHttp.finishTest(answers, username, userId);

  if (response.status == 200) {
    let resultsArr = response.data.resultsArray;
    // localStorage.clear();
    cleatLocalstorageTestRows();

    let testPageMain = document.querySelector(".test-page__main");
    testPageMain.innerHTML = "";
    resultsArr.forEach((testResult) => {
      let subjectName = impSubject200.subjects200[testResult.subjectCode];
      console.log(subjectName);
      //Переведення в 200
      let nmt = impSubject200[subjectName][testResult.matchingCount];
      let nmt200;
      if (nmt) {
        nmt200 = nmt;
      } else {
        nmt200 = "Не склав";
      }
      //Переведення в 12

      // Шукаємо відповідне значення
      let nmt12 = null;

      for (const key in impSubject200.mark12) {
        //console.log("key:", key);
        //console.log("nmt значення:", nmt);
        if (nmt200 == "Не склав") {
          nmt12 = 3;
        } else if (nmt200 < key) {
          nmt12 = impSubject200.mark12[key] - 1;
          //console.log("nmt12 значення:", nmt12);
          break;
        }
      }

      // if (nmt12 !== null) {
      //   console.log("Відповідне значення:", nmt12);
      // } else {
      //   nmt12 = 1
      //   console.log("Значення не знайдено.");
      // }

      testPageMain.innerHTML += `
      <div class="test__page-result"><b>${testResult.subjectName}:</b> ${testResult.matchingCount}/${testResult.generalAnswers} <b>НМТ:</b> ${nmt200} <b>Оцінка:</b> ${nmt12}</div>
       `;
    });

    // testPageMain.innerHTML += `
    // <a href = 'https://dev-validator.ztu.edu.ua/nmt24/%d0%a2%d0%b0%d0%b1%d0%bb%d0%b8%d1%86%d1%96%20%d0%bf%d0%b5%d1%80%d0%b5%d0%b2%d0%b5%d0%b4%d0%b5%d0%bd%d0%bd%d1%8f%20%d1%82%d0%b5%d1%81%d1%82%d0%be%d0%b2%d0%b8%d1%85%20%d0%b1%d0%b0%d0%bb%d1%96%d0%b2%20%d0%9d%d0%9c%d0%a2%20%d0%b2%20%d1%88%d0%ba%d0%b0%d0%bb%d1%83%20100%e2%80%93200%20%d0%b1%d0%b0%d0%bb%d1%96%d0%b2.pdf' target='_blank' style='margin:10px'>Таблиці переведення тестових балів НМТ в шкалу 100–200 балів</a>
    //  `;

    testPageMain.innerHTML += `
    <button class="test__page-return-to-main">На головну</button>
     `;
    let button = testPageMain.querySelector(".test__page-return-to-main");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      // localStorage.clear();
      cleatLocalstorageTestRows();
      location = importConfig.client_url;
    });
  } else {
    alert(
      "Помилка при автоматичній перевірці. Ваші відповіді відправлено на перевірку автору тесту"
    );
    // localStorage.clear();
    cleatLocalstorageTestRows();
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
  if (inputgroup == "Оберіть групу" || inputname == "Оберіть студента") {
    err++;
  }

  return { err, inputgroup, inputname };
}

async function resumeTest() {
  let username = window.name;
  let usergroup = window.group;
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
      await openTest(currentTest, answersArr);
      let testLength = localStorage.getItem("testLength");
      let testPaused = localStorage.getItem("testPaused");
      if (JSON.parse(testPaused) == true) {
        openAlert();
        openPausedTestAlert();
      } else {
        startTimer(new Date().getTime(), +testLength);
      }
    }
  }
}
// testDeadline = 2 * 60 * 60 * 1000
function startTimer(startTime, testDeadline = 2 * 60 * 60 * 1000) {
  if (!testDeadline) {
    testDeadline = 2 * 60 * 60 * 1000;
  }
  if (!startTime) {
    alert("Тест закінчився, час початку вичерпано або його не існує");
    stopTest();
  }
  clearInterval(timerInterval);
  let endTime = startTime + testDeadline;

  timerInterval = setInterval(function () {
    let timerPaused = localStorage.getItem("testPaused");
    if (JSON.parse(timerPaused) == true) {
      return;
    }
    let currentTime = new Date().getTime();
    let remainingTime = endTime - currentTime;
    localStorage.setItem("testLength", remainingTime);

    console.log("123", timerInterval);

    let totalSeconds = Math.floor(remainingTime / 1000);
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60);

    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    if (
      remainingTime <= 900000 ||
      importConfig.showFinishButton ||
      importConfig.adminMode
    ) {
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

function alertPopupFunctions() {
  let timerBlock = document.querySelector(".header__timer");
  if (!timerBlock) {
    return;
  }

  timerBlock.addEventListener("click", openAlert);
}
function openAlert() {
  let testMain = document.querySelector("main");
  let alert = document.createElement("div");
  alert.classList.add("alert-popup");
  alert.innerHTML = `
  <div class="alert-popup__content">
    <button class="close-popup">x</button>
    <h3 class="alert-popup__title">
      Ви хочете призупинити тестування через повітряну тривогу?
    </h3>
    <ul class="alert-popup__list">
      <li>
        <p class="alert-popup__text">
          тест буде призупинено на період повітряної тривоги
        </p>
      </li>
      <li>
        <p class="alert-popup__text">
          ваші відповіді залишаться на цьому пристрої, але НЕ будуть перевірені
          та збережені на сервері, до завершення тесту
        </p>
      </li>
      <li>
        <p class="alert-popup__text">
          ви зможете відновити проходження в будь-який момент після завершення
          тривоги
        </p>
      </li>
    </ul>
    <div  class="password-form">
      <p></p>
      <input class = "digit" type="text" name="" id="" />
      <button>Зупинити</button>
    </div>
  </div>
  `;

  let closePopupButton = alert.querySelector(".close-popup");
  closePopupButton.addEventListener("click", function () {
    alert.remove();
  });

  let pauseTestButton = alert.querySelector(".password-form button");
  pauseTestButton.addEventListener("click", pausedTest);
  testMain.appendChild(alert);
}

function pausedTest() {
  let alert = document.querySelector(".alert-popup");
  let errBlock = alert.querySelector(".password-form p");

  let code = alert.querySelector(".password-form input")?.value;
  let passCorrect = impSecurity.checkPauseCode(code);
  if (!passCorrect) {
    errBlock.innerHTML = "Невірний код";
    return;
  }

  localStorage.setItem("testPaused", true);
  openPausedTestAlert();
}

function openPausedTestAlert() {
  let alert = document.querySelector(".alert-popup");
  let username = localStorage.getItem("username");
  let usergroup = localStorage.getItem("usergroup");

  let alertMain = alert.querySelector(".alert-popup__content");
  alertMain.innerHTML = `   
  <p>Тест проходить: <b>${username}</b></p>
  <p>Тест проходить: <b>${usergroup}</b></p>
  <h1 class="resume-test__text">Тест зупинено через повітряну тривогу!</h1>
  <button class="resume-test__button">Продовжити тестування</button>`;

  let resumeTestButton = alert.querySelector(".resume-test__button");
  if (!resumeTestButton) {
    return console.log("Сталась помилка при пошуку кнопки продовження тесту");
  }
  resumeTestButton.addEventListener("click", removeAlertPopup);
}

function removeAlertPopup() {
  let alert = document.querySelector(".alert-popup");
  localStorage.setItem("testPaused", false);
  let testLength = localStorage.getItem("testLength");

  if (!alert) {
    return;
  }
  startTimer(new Date().getTime(), +testLength);
  alert.remove();
}

//Тимчасово для відображення кнопки Завершити тестування
let showTestButton = document.querySelector(".header__show-button");
showTestButton.addEventListener("click", showFinishTestButton());

function showFinishTestButton() {
  let stopTestButton = document.querySelector(".test-footer__finish");
  if (stopTestButton) {
    stopTestButton.classList.toggle("visible");
  }
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

function cleatLocalstorageTestRows() {
  localStorage.removeItem("currentTest");
  localStorage.removeItem("testLength");
  localStorage.removeItem("isTestPlaying");
  localStorage.removeItem("usergroup");
  localStorage.removeItem("username");
  localStorage.removeItem("startedAt");

  // видалення обєктів груп
  let choosedTests = localStorage.getItem("choosedTests");
  if (choosedTests) {
    choosedTests = JSON.parse(choosedTests);
    choosedTests.forEach((testID) => {
      localStorage.removeItem(testID);
    });
  }
  localStorage.removeItem("choosedTests");
}
