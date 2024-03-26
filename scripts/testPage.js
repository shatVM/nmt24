import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";

const urlParams = new URLSearchParams(window.location.search);

const testIdParam = urlParams.get("testId");

const newUrl = `${window.location.origin}${window.location.pathname}`;

window.history.replaceState({}, document.title, newUrl);

// запит до бази за тестом

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
      await startTest(testInfo, inputname, inputgroup);
    }
  });
}

async function startTest(testInfo, inputname, inputgroup) {
  console.log(testInfo);
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
  <div class="test-page__header-navigation header-navigation"></div>
  <div class="test-page__body test-body">
  <div class="test-body__task-number">
    Завдання <span class="currNum">0</span> з<span class="genNum">0</span>
  </div>
  <div class="question-block">
    
  </div>
  <div class="test-body__footer test-footer">
    <button class="test-footer__button test-footer__submit">
      Зберегти
    </button>
    <button class="test-footer__button test-footer__finish">
      Завершити тест
    </button>
  </div>
</div>
</div>
</div>`;

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

  let finishTestBtn = document.querySelector(".test-footer__finish");
  finishTestBtn.addEventListener("click", stopTest);
}

function stopTest() {
  localStorage.clear("username");
  localStorage.clear("usergroup");
  localStorage.clear("isTestPlaying");
  localStorage.clear("testPlayingId");
  location = importConfig.client_url;
}

function validateForm() {
  const pattern = /^[a-zA-Zа-яА-Я\s]+$/;
  let err = 0;
  let form = document.querySelector(".start-test-form");
  let inputname = form.querySelector("#name-input").value;
  let inputgroup = form.querySelector("#group-input").value;

  if (!inputname || !inputgroup) {
    err++;
    return err;
  }
  if (!pattern.test(inputname)) {
    console.log(pattern.test(inputname));
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
    // запит до бази
    console.log(testPlayingId);
    let testInfoResponse = await impHttp.getTestById(testPlayingId);
    if (testInfoResponse.status == 200) {
      let testInfo = testInfoResponse.data;

      await startTest(testInfo, username, usergroup);
    }
  }
}

function openQuestion(questionsArr, questionNumber) {
  let questionBlock = document.querySelector(".question-block");
  if (!questionBlock) {
    return;
  }
  let question = questionsArr[questionNumber];
  console.log(question);
  let questionElement = document.createElement("div");
  questionElement.classList.add("question");
  questionElement.setAttribute("questionNumber", questionNumber);
  questionElement.innerHTML = question.header;
  questionElement.innerHTML += question.body;
  questionBlock.innerHTML = "";
  questionBlock.appendChild(questionElement);
}

// <p class="question-alert-info">
//     Уважно прочитайте завдання, оберіть одну правильну відповідь
//   </p>
/* <div class="test-page__body test-body">
  <div class="test-body__task-number">
    Завдання <span class="currNum">1</span> з<span class="genNum">30</span>
  </div>
  <div class="question-block">
    <p class="question-alert-info">
      Уважно прочитайте завдання, оберіть одну правильну відповідь
    </p>
    <p class="question-text">
      У супермаркеті акція: купуєш три однакові шоколадки «Спокуса», а таку ж
      саму четверту супермаркет надає безкоштовно. Ціна кожної такої шоколадки –
      35 грн. У покупця є 220 грн. Яку максимальну кількість шоколадок «Спокуса»
      він зможе отримати, узявши участь в акції?
    </p>
    <p>
      <img
        class="question-img"
        alt=""
        src="https://lh7-us.googleusercontent.com/Sv7Be8Hq-ihAQFbRnnmcfzwcIZvpBc_TUFk8oZ7AK0vZl1umPznHOBQCbiaNVYBuJbhnO4rb3csfiAOEm_N_AdP6U9aE3vbGTD8IzHhYzljiSZqfwJwqyjpY8y16IhiX06c39jwxFwxoUfe_SUUu8Q"
        title=""
      />
    </p>
    <p></p>
    <p class="answers-title">Варіанти відповіді</p>
    <p></p>
    <a></a>
    <a></a>
    <table class="answers-table">
      <tr>
        <td>
          <p class="answers-table__option">А</p>
        </td>
        <td>
          <p class="answers-table__option">Б</p>
        </td>
        <td>
          <p class="answers-table__option">В</p>
        </td>
        <td>
          <p class="answers-table__option">Г</p>
        </td>
        <td>
          <p class="answers-table__option">Д</p>
        </td>
      </tr>
      <tr>
        <td>
          <p class="answers-table__option-text"></p>
        </td>
        <td>
          <p class="answers-table__option-text"></p>
        </td>
        <td>
          <p class="answers-table__option-text"></p>
        </td>
        <td>
          <p class="answers-table__option-text"></p>
        </td>
      </tr>
    </table>
  </div>
</div> */
