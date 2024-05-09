import * as importFile from "./components/dropdown.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";
import * as impSecurity from "./dev/security.js";
import * as impPopups from "./components/popups.js";
import { enterPassCode, timeoutPassCode } from "./dev/security.js";
const testMenu = document.querySelector(".main-page__tests-menu");
const urlParams = new URLSearchParams(window.location.search);


const tokenParam = urlParams.get('accessToken');
if (tokenParam != null){
  localStorage.setItem("token", tokenParam);
  // window.history.pushState(null, 'Головна', importConfig.client_url);
}

userLogin();

async function userLogin() {
  let loginForm = document.querySelector(".login-form");
  if (!loginForm) return;
  let authResponse = await impHttp.isAuth();
  if (authResponse.status == 200) {
    loginForm.remove();
    createMainPage();
  } else {
    let submitLoginButton = loginForm.querySelector(".login-form-submit");
    if (submitLoginButton) {
      submitLoginButton.addEventListener("click", async function (e) {
        e.preventDefault();
        let errorsBlock = loginForm.querySelector("p");
        let email = loginForm.querySelector(".login-form-email")?.value;
        let password = loginForm.querySelector(".login-form-password")?.value;
        if ((!email && errorsBlock) || (!password && errorsBlock)) {
          errorsBlock.innerHTML =
            "Перевірте логін та пароль для входу в систему";
        }
        email = email.trim();
        password = password.trim();
        let loginResponse = await impHttp.login(email, password);
        if (loginResponse.status == 200) {
          loginForm.remove();
          createMainPage();
        } else {
          if (errorsBlock) {
            errorsBlock.innerHTML = "невірний пароль для входу в систему";
          }
        }
      });
    }
  }
}

const alertParam = urlParams.get('alert');
if (alertParam != null) {
  let popupObj = impPopups.alertPopup(alertParam);
  document.querySelector("body").appendChild(popupObj.popup);
  let okButton = popupObj.okButton;
  okButton.addEventListener("click", async function (e) {
    e.preventDefault();
    popupObj.popup.remove();
  })
}

async function createMainPage() {
  // очистка обраних предметів якшо вони є
  localStorage.setItem("choosedTests", "[]");

  let testsResponse = await impHttp.getTests();
  if (testsResponse.status != 200) {
    return alert("Спробуйте оновити сторінку, помилка при отриманні даних");
  }
  let testsInfo = testsResponse.data;
  testMenu.innerHTML = "";

  testsInfo.forEach((test, subjectIndex) => {
    let subject = test.subject;
    let sectionBody = test.tests;

    let section = document.createElement("div");
    section.classList.add("tests-menu__section");
    let sectionTitle = document.createElement("h3");
    sectionTitle.innerHTML = subject;

    let sectionBodyBlock = document.createElement("div");
    sectionBodyBlock.classList.add(
      "tests-menu__section-dropdown",
      "section-dropdown"
    );

    sectionBody.forEach((element, testIndex) => {
      let elementBlock = document.createElement("div");
      elementBlock.classList.add("section-dropdown__item");
      let checkbox = document.createElement("input");
      checkbox.classList.add("test-check-box");
      checkbox.id = `i${subjectIndex}${testIndex}`;
      checkbox.type = "checkbox";

      let elementBlockLink = document.createElement("label");
      // (elementBlockLink.href = `${importConfig.client_url}/testPage.html?testId=${element.testId}&name=${element.name}&subject=${element.subject}`),
      elementBlockLink.innerText = element.name;
      elementBlockLink.style.cursor = "pointer";
      elementBlockLink.style.userSelect = "none";
      elementBlockLink.setAttribute("for", `i${subjectIndex}${testIndex}`);
      let elementBlockDescription = document.createElement("span");
      elementBlockDescription.innerText = element.description;
      elementBlockDescription.classList.add('short-description');
      elementBlock.appendChild(checkbox);
      elementBlock.appendChild(elementBlockLink);
      elementBlock.appendChild(elementBlockDescription);
      sectionBodyBlock.appendChild(elementBlock);
      //console.log(subjectIndex,testIndex);

      // лісенери на чекбокс елемента
      checkbox.addEventListener("click", function () {
        if (checkbox.checked) {
          let choosedTestsArr = localStorage.getItem("choosedTests");
          if (!choosedTestsArr) {
            return console.error(
              "В системі відсутній масив обраних тестів, перезавантажте сторінку"
            );
          }
          choosedTestsArr = JSON.parse(choosedTestsArr);

          if (choosedTestsArr.length > 1) {
            alert("К-ть обраних тестів не може бути більше двох");
            checkbox.checked = false;
            return;
          }
          if (!choosedTestsArr.includes(element.testId)) {
            choosedTestsArr.push(element.testId);
          }
          localStorage.setItem("choosedTests", JSON.stringify(choosedTestsArr));
        } else {
          let choosedTestsArr = localStorage.getItem("choosedTests");
          if (!choosedTestsArr) {
            return console.error(
              "В системі відсутній масив обраних тестів, перезавантажте сторінку"
            );
          }
          choosedTestsArr = JSON.parse(choosedTestsArr);
          choosedTestsArr = choosedTestsArr.filter((testId) => {
            return testId != element.testId;
          });
          localStorage.setItem("choosedTests", JSON.stringify(choosedTestsArr));
        }
      });
    });
    //// збір елемента
    section.appendChild(sectionTitle);
    section.appendChild(sectionBodyBlock);
    importFile.dropdownMenu(section, sectionTitle);
    testMenu.appendChild(section);
  });

  if (importConfig.adminMode == 1) {
    let checkboxList = document.querySelectorAll('input[type="checkbox"]');
    checkboxList.forEach((element, checkIndex) => {
      console.log(checkboxList);
      if (checkIndex > 1) {
      } else {
        element.click();
      }
    });
  }
  startTestButton();
}

function startTestButton() {
  let startButton = document.querySelector(".main-page__buttons");
  if (!startButton) {
    return;
  }
  startButton.addEventListener("click", function () {
    let choosedTestsArr = localStorage.getItem("choosedTests");
    if (!choosedTestsArr) {
      return console.error(
        "В системі відсутній масив обраних тестів, перезавантажте сторінку"
      );
    }
    choosedTestsArr = JSON.parse(choosedTestsArr);
    if (choosedTestsArr.length == 0) {
      return alert("оберіть тести для проходження");
    }

    location = `${
      importConfig.client_url
    }/testPage.html?testId=${123}&name=${1234}&subject=${1}`;
  });
}
