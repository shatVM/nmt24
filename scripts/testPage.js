import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";

let timerInterval = null;

const urlParams = new URLSearchParams(window.location.search);

const testIdParam = urlParams.get("testId");

const newUrl = `${window.location.origin}${window.location.pathname}`;

window.history.replaceState({}, document.title, newUrl);

// запит до бази за тестом
let playingTest = localStorage.getItem("isTestPlaying");

if (
  (!testIdParam && JSON.parse(playingTest) == false) ||
  (!testIdParam && !playingTest)
) {
  location = importConfig.client_url;
  window.history.replaceState({}, document.title, importConfig.client_url);
  stopTest();
}

let testInfo = {};

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
    let testInfoResponse = await impHttp.getTestById(testIdParam);
    if (testInfoResponse.status == 200) {
      let testInfo = testInfoResponse.data;

      // записуємо в локалсторейдж дані про проходження
      localStorage.setItem("username", inputname);
      localStorage.setItem("usergroup", inputgroup);
      localStorage.setItem("isTestPlaying", true);
      localStorage.setItem("testPlayingId", testIdParam);
      let testQuestions = JSON.parse(testInfo.questions);
      let array = createEmptyAnswersArr(testQuestions);
      localStorage.setItem("answers", JSON.stringify(array));
      let startTime = new Date().getTime();

      localStorage.setItem("startedAt", startTime);

      await startTest(testInfo, inputname, inputgroup, startTime);
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
        answer = [null];
        break;
      case 7:
        answer = [null, null];
        break;
      case 8:
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

function showAnsweredInNav(answers) {
  let navigation = document.querySelector(".test-page__header-navigation ");
  let navButtons = navigation.querySelectorAll(".header-navigation__item");

  navButtons.forEach((item, i) => {
    if (answers[i].submitted) {
      item.classList.add("passed");
    }
  });
}

async function startTest(
  testInfo,
  inputname,
  inputgroup,
  startTime,
  answersArr = null
) {
  startTimer(startTime);

  let testQuestions = JSON.parse(testInfo.questions);

  // вставляємо дані
  let subject = document.querySelector(".test-page__header .subject");
  subject.innerHTML = testInfo.subjectName;
  let testPageHeader = document.querySelector(".test-page__header");
  testPageHeader.innerHTML += `<p class="user_name">
  Тестування проходить:
  <span class="name">${inputname}</span>, група
  <span class="group">${inputgroup}</span>
</p>`;

  let testPageMain = document.querySelector(".test-page__main");

  testPageMain.innerHTML = ` <div class="test-wrapper">

  <div class="header__timer">
  <span class="header__timer-time"></span>
  </div>

  <div class="test-page__header-navigation header-navigation"></div>
  <div class="test-page__body test-body">
  <div class="test-body__task-number">
 
  </div>
  <div class="question-block">
    
  </div>
  <div class="test-body__footer test-footer">
    <div class = 'test-footer__submit-wrapper'>
     
    </div>
    <button class="test-footer__button test-footer__finish">
      Завершити тест
    </button>
  </div>
</div>
</div>
</div>`;

  // відкриваємо перше питання
  testQuestions.forEach((question, i) => {
    let navigation = testPageMain.querySelector(".header-navigation");
    if (!navigation) {
      return;
    }
    let menuElement = document.createElement("div");
    menuElement.classList.add("header-navigation__item");
    menuElement.setAttribute("questionNum", i);
    menuElement.innerHTML = i + 1;
    menuElement.addEventListener("click", function () {
      let questionNumber = menuElement.getAttribute("questionNum");
      openQuestion(testQuestions, questionNumber);
    });
    navigation.appendChild(menuElement);
  });

  openQuestion(testQuestions, 0);

  if (answersArr != null) {
    showAnsweredInNav(answersArr);
  }

  let finishTestBtn = document.querySelector(".test-footer__finish");
  finishTestBtn.addEventListener("click", stopTest);
}

async function stopTest() {
  let answers = localStorage.getItem("answers");
  let testId = localStorage.getItem("testPlayingId");
  let response = await impHttp.finishTest(answers, testId);
  if (response.status == 200) {
    let correctAnswers = response.data.matchingCount;
    let generalAnswers = response.data.generalAnswers;
    localStorage.clear("username");
    localStorage.clear("usergroup");
    localStorage.clear("isTestPlaying");
    localStorage.clear("testPlayingId");
    localStorage.clear("answers");
    localStorage.clear();

    let testPageMain = document.querySelector(".test-page__main");

    testPageMain.innerHTML = `
    <div class="test__page-result">Ваш результат ${correctAnswers}/${generalAnswers}</div>
    <button class="test__page-return-to-main">На головну</button> `;
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
    localStorage.clear("username");
    localStorage.clear("usergroup");
    localStorage.clear("isTestPlaying");
    localStorage.clear("testPlayingId");
    localStorage.clear("answers");
    localStorage.clear();
    location = importConfig.client_url;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}

function validateForm() {
  const pattern = /^[a-zA-Zа-яА-Я\s]+$/;
  let err = 0;
  let form = document.querySelector(".start-test-form");
  let inputname = form.querySelector("#name-input").value;
  let inputgroup = form.querySelector("#group-input").value;

  if (!inputname || !inputgroup) {
    err++;
    return { err };
  }
  if (!pattern.test(inputname) || inputname == "" || inputname == " ") {
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
  let testPlayingId = localStorage.getItem("testPlayingId");
  if (JSON.parse(isTestPlaying) == true && testPlayingId) {
    let testInfoResponse = await impHttp.getTestById(testPlayingId);
    if (testInfoResponse.status == 200) {
      let testInfo = testInfoResponse.data;

      let answersArr = localStorage.getItem("answers");
      if (!answersArr) {
        let testQuestions = JSON.parse(testInfo.questions);
        let array = createEmptyAnswersArr(testQuestions);
        localStorage.setItem("answers", JSON.stringify(array));
      }
      answersArr = JSON.parse(answersArr);
      let startTime = localStorage.getItem("startedAt");

      await startTest(testInfo, username, usergroup, +startTime, answersArr);
    }
  }
}
function startTimer(startTime, testDeadline = 60 * 60 * 1000) {
  if (!startTime) {
    alert("Тест закінчився, час початку вичерпано або його не існує");
    stopTest();
  }
  let endTime = startTime + testDeadline;

  timerInterval = setInterval(function () {
    let currentTime = new Date().getTime();
    let remainingTime = endTime - currentTime;

    let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    let timerBlock = document.querySelector(".header__timer-time");
    if (timerBlock) {
      timerBlock.innerHTML = `${minutes}:${seconds}`;
    }

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      stopTest();
    }
  }, 100);
}
function openQuestion(questionsArr, questionNumber) {
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
  questionElement.innerHTML = question.header;
  questionElement.innerHTML += question.body;
  questionBlock.innerHTML = "";
  let answers = createBlockByType(question.type, questionNumber, questionsArr);

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

function createBlockByType(type, questionNumber, questionsArr) {
  let answersBlock = document.createElement("div");
  answersBlock.classList.add("answers-block");
  switch (type) {
    case 0:
      answersBlock.appendChild(
        chooseOneAnswerOf4(questionsArr, questionNumber)
      );
      return answersBlock;
    case 1:
      answersBlock.appendChild(
        chooseOneAnswerOf5(questionsArr, questionNumber)
      );
      return answersBlock;
    case 2:
      answersBlock.appendChild(chooseMany3x5(questionsArr, questionNumber));
      return answersBlock;
    case 3:
      answersBlock.appendChild(chooseMany4x4(questionsArr, questionNumber));
      return answersBlock;
    case 4:
      answersBlock.appendChild(chooseMany4x5(questionsArr, questionNumber));
      return answersBlock;
    case 5:
      answersBlock.appendChild(chooseMany5x8(questionsArr, questionNumber));
      return answersBlock;
    case 6:
      answersBlock.appendChild(enter1digit(questionsArr, questionNumber));
      return answersBlock;
    case 7:
      answersBlock.appendChild(enter2digits(questionsArr, questionNumber));
      return answersBlock;
    case 8:
      answersBlock.appendChild(enter3digits(questionsArr, questionNumber));
      return answersBlock;
    case 9:
      answersBlock.appendChild(
        chooseOneAnswerOf4(questionsArr, questionNumber, "eng")
      );
      return answersBlock;
    case 10:
      answersBlock.appendChild(
        chooseOneAnswerOf8(questionsArr, questionNumber, "eng")
      );
      return answersBlock;
    default:
      return answersBlock;
  }
}

function chooseOneAnswerOf4(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
      <tr>
        <td>
          <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
        </td>
      </tr>
      <tr class = 'answers-options-row'>
        <td>
          <input answer = "А" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer.includes("А") ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Б" class="answers-table__option" type="checkbox"  ${
            thisQuestion.answer.includes("Б") ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "В" class="answers-table__option" type="checkbox"  ${
            thisQuestion.answer.includes("В") ? "checked" : ""
          } name="" id="" />
        </td>
        <td>
          <input answer = "Г" class="answers-table__option" type="checkbox" ${
            thisQuestion.answer.includes("Г") ? "checked" : ""
          } name="" id="" />
        </td>
      </tr>
      `;

  let optionRow = answerTable.querySelector(".answers-options-row");
  let options = optionRow.querySelectorAll(".answers-table__option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((option) => {
        option.checked = false;
      });
      option.checked = true;
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let optionRow = answerTable.querySelector(".answers-options-row");
    let options = optionRow.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      if (option.checked) {
        let localAnswers = localStorage.getItem("answers");
        localAnswers = JSON.parse(localAnswers);
        if (!localAnswers) {
          return console.error("Error, cannot save your answer");
        }
        localAnswers[questionNumber].answer = [option.getAttribute("answer")];
        localAnswers[questionNumber].submitted = true;
        localStorage.setItem("answers", JSON.stringify(localAnswers));
        showAnsweredInNav(localAnswers);
        openQuestion(questionsArr, +questionNumber + 1);
      }
    });
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function chooseOneAnswerOf5(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
      <tr>
        <td>
          <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
        </td>
        <td>
        <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
        </td>
      </tr>
      <tr class = 'answers-options-row'>
        <td>
          <input answer = "А" ${
            thisQuestion.answer.includes("А") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Б" ${
            thisQuestion.answer.includes("Б") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "В" ${
            thisQuestion.answer.includes("В") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Г" ${
            thisQuestion.answer.includes("Г") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
        <input answer = "Д" ${
          thisQuestion.answer.includes("Д") ? "checked" : ""
        } class="answers-table__option" type="checkbox" name="" id="" />
      </td>
      </tr>
      `;

  let optionRow = answerTable.querySelector(".answers-options-row");
  let options = optionRow.querySelectorAll(".answers-table__option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((option) => {
        option.checked = false;
      });
      option.checked = true;
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let optionRow = answerTable.querySelector(".answers-options-row");
    let options = optionRow.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      if (option.checked) {
        let localAnswers = localStorage.getItem("answers");
        localAnswers = JSON.parse(localAnswers);
        if (!localAnswers) {
          return console.error("Error, cannot save your answer");
        }
        localAnswers[questionNumber].answer = [option.getAttribute("answer")];
        localAnswers[questionNumber].submitted = true;
        localStorage.setItem("answers", JSON.stringify(localAnswers));
        showAnsweredInNav(localAnswers);
        openQuestion(questionsArr, +questionNumber + 1);
      }
    });
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}

function chooseOneAnswerOf8(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
      <tr>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "F" : "Е"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "G" : "Є"}</p>
      </td>
      <td>
      <p class="answers-table__option">${subject == "eng" ? "H" : "Ж"}</p>
      </td>
      </tr>
      <tr class = 'answers-options-row'>
        <td>
          <input answer = "А" ${
            thisQuestion.answer.includes("А") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Б" ${
            thisQuestion.answer.includes("Б") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "В" ${
            thisQuestion.answer.includes("В") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Г" ${
            thisQuestion.answer.includes("Г") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Д" ${
            thisQuestion.answer.includes("Д") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Е" ${
            thisQuestion.answer.includes("Е") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Є" ${
            thisQuestion.answer.includes("Є") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
        <td>
          <input answer = "Ж" ${
            thisQuestion.answer.includes("Ж") ? "checked" : ""
          } class="answers-table__option" type="checkbox" name="" id="" />
        </td>
      </tr>
      `;

  let optionRow = answerTable.querySelector(".answers-options-row");
  let options = optionRow.querySelectorAll(".answers-table__option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((option) => {
        option.checked = false;
      });
      option.checked = true;
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let optionRow = answerTable.querySelector(".answers-options-row");
    let options = optionRow.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      if (option.checked) {
        let localAnswers = localStorage.getItem("answers");
        localAnswers = JSON.parse(localAnswers);
        if (!localAnswers) {
          return console.error("Error, cannot save your answer");
        }
        localAnswers[questionNumber].answer = [option.getAttribute("answer")];
        localAnswers[questionNumber].submitted = true;
        localStorage.setItem("answers", JSON.stringify(localAnswers));
        showAnsweredInNav(localAnswers);
        openQuestion(questionsArr, +questionNumber + 1);
      }
    });
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function chooseMany4x4(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
 
  <tr>
  <td>
  <p class="answers-table__option"></p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">1</p>
    </td>
     <td>
        <input answer = "А" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "А" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">2</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "А" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Б" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "Б" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "В" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "В" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Г" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "Г" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">3</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "А" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Б" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "Б" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "В" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "В" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Г" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "Г" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">4</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[3] == "А" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Б" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[3] == "Б" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "В" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[3] == "В" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Г" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[3] == "Г" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>

      `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function chooseMany3x5(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
  
  <tr>
  <td>
  <p class="answers-table__option"></p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">1</p>
    </td>
    <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "А" ? "checked" : ""
      } name="" id="" />
      </td>
      <td>
        <input answer = "Б" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Б" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "В" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "В" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
        <input answer = "Г" class="answers-table__option" type="checkbox" ${
          thisQuestion.answer[0] == "Г" ? "checked" : ""
        } name="" id="" />
      </td>
      <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">2</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "А" ? "checked" : ""
    } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">3</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "А" ? "checked" : ""
    } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>

      `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function chooseMany4x5(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
  
  <tr>
  <td>
  <p class="answers-table__option"></p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">1</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "А" ? "checked" : ""
    } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td> 
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">2</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "А" ? "checked" : ""
    } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td> 
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[1] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[1] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">3</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "А" ? "checked" : ""
    } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td> 
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[2] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[2] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">4</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[3] == "А" ? "checked" : ""
    } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td> 
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[3] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[3] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>
      `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function chooseMany5x8(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table");
  answerTable.innerHTML = `
 
  <tr>
  <td>
  <p class="answers-table__option"></p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "A" : "А"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "B" : "Б"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "C" : "В"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "D" : "Г"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "E" : "Д"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "F" : "Е"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "G" : "Є"}</p>
  </td>
  <td>
  <p class="answers-table__option">${subject == "eng" ? "H" : "Ж"}</p>
  </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">1</p>
    </td>
    <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">2</p>
    </td>
    <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">3</p>
    </td>
    <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">4</p>
    </td>
    <td>
      <input answer = "А" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "А" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Б" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Б" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "В" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "В" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Г" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Г" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Д" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Д" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Е" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Е" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Є" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Є" ? "checked" : ""
      } name="" id="" />
    </td>
    <td>
      <input answer = "Ж" class="answers-table__option" type="checkbox" ${
        thisQuestion.answer[0] == "Ж" ? "checked" : ""
      } name="" id="" />
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <p class="answers-table__option">5</p>
    </td>
    <td>
    <input answer = "А" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "А" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Б" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Б" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "В" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "В" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Г" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Г" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Д" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Д" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Е" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Е" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Є" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Є" ? "checked" : ""
    } name="" id="" />
  </td>
  <td>
    <input answer = "Ж" class="answers-table__option" type="checkbox" ${
      thisQuestion.answer[0] == "Ж" ? "checked" : ""
    } name="" id="" />
  </td>
  </tr>

      `;

  let optionRows = answerTable.querySelectorAll(".answers-options-row");
  optionRows.forEach((row) => {
    let options = row.querySelectorAll(".answers-table__option");
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((option) => {
          option.checked = false;
        });
        option.checked = true;
      });
    });
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let thisAnswers = [];
    let optionRows = answerTable.querySelectorAll(".answers-options-row");
    optionRows.forEach((row) => {
      let options = row.querySelectorAll(".answers-table__option");
      let findAnswer = false;
      options.forEach((option) => {
        if (option.checked) {
          findAnswer = true;
          thisAnswers.push(option.getAttribute("answer"));
        }
      });
      if (!findAnswer) {
        thisAnswers.push(null);
      }
    });

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = thisAnswers;
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function enter1digit(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table", "enter-digit");
  answerTable.innerHTML = `
  <tr>
    <td>
      <p class="answers-table__option">${
        subject == "eng" ? "Enter answer" : "Впишіть відповідь"
      }</p>
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <input type="text" value = ${
        thisQuestion.answer[0] != null ? thisQuestion.answer[0] : ""
      } >
    </td>
  </tr>
      `;

  let digitInput = answerTable.querySelector(".answers-options-row input");
  digitInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char == "-" && i == 0) {
        filteredValue += char;
      }
      if (!isNaN(char) && char !== "," && char !== "." && char !== " ") {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let digitInput = answerTable.querySelector(".answers-options-row input");
    if (!digitInput) {
      return console.error("Error, cannot save your answer");
    }
    let value = digitInput.value;

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = [value];
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function enter2digits(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table", "enter-digit-2");
  answerTable.innerHTML = `
  <tr>
    <td colspan="3">
    <p class="answers-table__option">${
      subject == "eng" ? "Enter answer" : "Впишіть відповідь"
    }</p>
    </td>
  </tr>
  <tr class="answers-options-row">
    <td>
      <input class="whole" type="text" value = ${
        thisQuestion.answer[0] != null ? thisQuestion.answer[0] : ""
      } >
    </td>
    <td>
      <p class="answers-table__option">,</p>
    </td>
    <td>
      <input class="fractional" type="text" ${
        thisQuestion.answer[1] != null ? thisQuestion.answer[1] : ""
      } >
    </td>
  </tr>
      `;

  // перевірка на ціле число
  let digitInput1 = answerTable.querySelector(
    ".answers-options-row input.whole"
  );
  digitInput1.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char == "-" && i == 0) {
        filteredValue += char;
      }
      if (!isNaN(char) && char !== "," && char !== "." && char !== " ") {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  });

  // перевірка на дробове число
  let digitInput2 = answerTable.querySelector(
    ".answers-options-row input.fractional"
  );
  digitInput2.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (char == 0 && i == 0) {
        filteredValue += char;
      }
      if (
        !isNaN(char) &&
        char !== "," &&
        char !== "." &&
        char !== " " &&
        char != "-" &&
        char != 0
      ) {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  });

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let digitInput1 = answerTable.querySelector(
      ".answers-options-row input.whole"
    );
    let digitInput2 = answerTable.querySelector(
      ".answers-options-row input.fractional"
    );
    if (!digitInput1 || !digitInput2) {
      return console.error("Error, cannot save your answer");
    }
    let whole = digitInput1.value;
    let fractional = digitInput2.value;
    if (fractional == "") {
      fractional = 0;
    }
    if (whole == "") {
      whole = 0;
    }

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = [whole, fractional];
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
}
function enter3digits(questionsArr, questionNumber, subject) {
  let answersArr = localStorage.getItem("answers");
  if (!answersArr) {
    return;
  }

  answersArr = JSON.parse(answersArr);
  let thisQuestion = answersArr[questionNumber];

  let answerTable = document.createElement("table");
  answerTable.classList.add("answers-table", "enter-digit-2");
  answerTable.innerHTML = `
  <tr>
  <td colspan="3">
  <p class="answers-table__option">${
    subject == "eng" ? "Enter answer" : "Впишіть відповідь"
  }</p>
  </td>
</tr>
<tr class="answers-options-row">
  <td>
    <input class="digit-1" type="number" value = ${
      thisQuestion.answer[0] != null ? thisQuestion.answer[0] : ""
    } />
  </td>
  <td>
    <input class="digit-2" type="number" value = ${
      thisQuestion.answer[0] != null ? thisQuestion.answer[1] : ""
    } />
  </td>
  <td>
    <input class="digit-3" type="number" value = ${
      thisQuestion.answer[0] != null ? thisQuestion.answer[2] : ""
    } />
  </td>
</tr>
      `;

  // перевірка на ціле число
  let digitInput1 = answerTable.querySelector(
    ".answers-options-row input.digit-1"
  );
  digitInput1.addEventListener("input", function (e) {
    validateInput(e);
  });
  let digitInput2 = answerTable.querySelector(
    ".answers-options-row input.digit-2"
  );
  digitInput2.addEventListener("input", function (e) {
    validateInput(e);
  });
  let digitInput3 = answerTable.querySelector(
    ".answers-options-row input.digit-3"
  );
  digitInput3.addEventListener("input", function (e) {
    validateInput(e);
  });

  function validateInput(event) {
    let inputValue = event.target.value;
    if (inputValue.startsWith("0")) {
      event.target.value = inputValue.slice(1);
      return;
    }
    let filteredValue = "";
    for (let i = 0; i < inputValue.length; i++) {
      let char = inputValue[i];
      if (
        !isNaN(char) &&
        char !== "," &&
        char !== "." &&
        char !== " " &&
        char !== "-"
      ) {
        filteredValue += char;
      }
    }
    event.target.value = filteredValue;
  }

  let submitButtonWrapper = document.querySelector(
    ".test-footer__submit-wrapper"
  );

  let button = document.createElement("button");
  button.classList.add("test-footer__button", "test-footer__submit");
  button.innerHTML = "Зберегти";
  button.addEventListener("click", function () {
    let digitInput1 = answerTable.querySelector(
      ".answers-options-row input.digit-1"
    );
    let digitInput2 = answerTable.querySelector(
      ".answers-options-row input.digit-2"
    );
    let digitInput3 = answerTable.querySelector(
      ".answers-options-row input.digit-3"
    );
    if (!digitInput1 || !digitInput2 || !digitInput3) {
      return console.error("Error, cannot save your answer");
    }

    digitInput1 = digitInput1.value;
    digitInput2 = digitInput2.value;
    digitInput3 = digitInput3.value;

    let localAnswers = localStorage.getItem("answers");
    localAnswers = JSON.parse(localAnswers);
    if (!localAnswers) {
      return console.error("Error, cannot save your answer");
    }
    localAnswers[questionNumber].answer = [
      digitInput1,
      digitInput2,
      digitInput3,
    ];
    localAnswers[questionNumber].submitted = true;
    localStorage.setItem("answers", JSON.stringify(localAnswers));
    showAnsweredInNav(localAnswers);
    openQuestion(questionsArr, +questionNumber + 1);
  });
  submitButtonWrapper.appendChild(button);

  return answerTable;
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
