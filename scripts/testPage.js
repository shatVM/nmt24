import * as importConfig from "./dev/config.js";

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
  startTestButton.addEventListener("click", function (e) {
    e.preventDefault();
    let { err, inputgroup, inputname } = validateForm();
    if (err > 0) {
      alert("Перевірте правильність вводу даних");
      return;
    }

    startTest(testInfo, inputname, inputgroup);
  });
}

function startTest(testInfo, inputname, inputgroup) {
  // записуємо в локалсторейдж дані про проходження
  localStorage.setItem("username", inputname);
  localStorage.setItem("usergroup", inputgroup);
  localStorage.setItem("isTestPlaying", true);
  localStorage.setItem("testPlayingId", testIdParam);

  // вставляємо дані
  let testPageHeader = document.querySelector(".test-page__header");
  testPageHeader.innerHTML += `<p class="user_name">
  Тестування проходить:
  <span class="name">${inputname}</span>, група
  <span class="group">${inputgroup}</span>
</p>`;

  let testPageMain = document.querySelector(".test-page__main");
  testPageMain.innerHTML = ` <div class="test-wrapper">
  <div class="test-page__header-navigation header-navigation">
    <div class="header-navigation__item active">1</div>
    <div class="header-navigation__item">2</div>
    <div class="header-navigation__item">3</div>
    <div class="header-navigation__item">4</div>
    <div class="header-navigation__item">5</div>
    <div class="header-navigation__item">6</div>
    <div class="header-navigation__item">7</div>
    <div class="header-navigation__item">8</div>
    <div class="header-navigation__item">9</div>
    <div class="header-navigation__item">10</div>
    <div class="header-navigation__item">11</div>
    <div class="header-navigation__item">12</div>
    <div class="header-navigation__item">13</div>
    <div class="header-navigation__item">14</div>
    <div class="header-navigation__item">15</div>
    <div class="header-navigation__item">16</div>

  </div>
  <div class="test-page__body test-body">
    <div class="test-body__task-number">
      Завдання <span class="currNum">1</span> з<span class="genNum"
        >30</span
      >
    </div>
    <div class="question-block">
      <p class="question-alert-info">
        Уважно прочитайте завдання, оберіть одну правильну відповідь
      </p>
      <p class="question-text">
        У супермаркеті акція: купуєш три однакові шоколадки
        «Спокуса», а таку ж саму четверту супермаркет надає
        безкоштовно. Ціна кожної такої шоколадки – 35 грн. У покупця
        є 220 грн. Яку максимальну кількість шоколадок «Спокуса» він
        зможе отримати, узявши участь в акції?
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
    <div class="test-body__footer test-footer">
      <button class="test-footer__button test-footer__submit">
        Зберегти
      </button>
      <button class="test-footer__button test-footer__finish">
        Завершити тест
      </button>
    </div>
  </div>
</div>`;

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

function resumeTest() {
  let username = localStorage.getItem("username");
  let usergroup = localStorage.getItem("usergroup");
  let isTestPlaying = localStorage.getItem("isTestPlaying");
  let testPlayingId = localStorage.getItem("testPlayingId");
  if (JSON.parse(isTestPlaying) == true && testPlayingId) {
    // запит до бази
    startTest(testInfo, username, usergroup);
  }
}
