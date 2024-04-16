import * as importFile from "./components/dropdown.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";
import * as impSecurity from "./security.js";

// перевірка коду при вході на сторінку
let loginForm = document.querySelector(".main-page__login");
if (loginForm) {
  let submitLoginButton = loginForm.querySelector(".main-page__login-submit");
  if (submitLoginButton) {
    submitLoginButton.addEventListener("click", async function (e) {
      e.preventDefault();
      let errorsBlock = loginForm.querySelector("p");
      let password = loginForm.querySelector(".main-page-password")?.value;
      if (!password && errorsBlock) {
        errorsBlock.innerHTML = "невірний пароль для входу в систему";
      }

      let rightAnswer = impSecurity.checkSecurityCode(password);

      if (rightAnswer) {
        loginForm.remove();
        await createMainPage();
      } else {
        if (errorsBlock) {
          errorsBlock.innerHTML = "невірний пароль для входу в систему";
        }
      }
    });
  }
} else {
  console.error("Немає потрібних html елементів");
}

const testMenu = document.querySelector(".main-page__tests-menu");
// createMainPage();
async function createMainPage() {
  // очистка обраних предметів якшо вони є
  localStorage.clear("choosedTests");
  localStorage.setItem("choosedTests", "[]");

  let testsResponse = await impHttp.getTests();
  if (testsResponse.status != 200) {
    return alert("Спробуйте оновити сторінку, помилка при отриманні даних");
  }
  let testsInfo = testsResponse.data;

  testsInfo.forEach((test,subjectIndex) => {
    
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
   
    sectionBody.forEach((element,testIndex) => {
      let elementBlock = document.createElement("div");
      elementBlock.classList.add("section-dropdown__item");
      let checkbox = document.createElement("input");
      checkbox.classList.add("test-check-box");
      checkbox.id = `i${subjectIndex}${testIndex}`
      checkbox.type = "checkbox";

      let elementBlockLink = document.createElement("label");
      // (elementBlockLink.href = `${importConfig.client_url}/testPage.html?testId=${element.testId}&name=${element.name}&subject=${element.subject}`),
      elementBlockLink.innerText = element.name;
      elementBlockLink.style.cursor = "pointer";
      elementBlockLink.style.userSelect = "none";
      elementBlockLink.setAttribute("for", `i${subjectIndex}${testIndex}`)
      elementBlock.appendChild(checkbox);
      elementBlock.appendChild(elementBlockLink);
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

  if (importConfig.adminMode == 1){
      let checkboxList = document.querySelectorAll('input[type="checkbox"]')
      checkboxList.forEach((element, checkIndex) =>{
      console.log(checkboxList)
        if (checkIndex > 1){
        } else {
          element.click()
        }
      })
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
