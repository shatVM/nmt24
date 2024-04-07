import * as importFile from "./components/dropdown.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";

const testMenu = document.querySelector(".main-page__tests-menu");
createMainPage();
async function createMainPage() {
  // очистка обраних предметів якшо вони є
  localStorage.clear("choosedTests");
  localStorage.setItem("choosedTests", "[]");

  let testsResponse = await impHttp.getTests();
  if (testsResponse.status != 200) {
    return alert("Спробуйте оновити сторінку, помилка при отриманні даних");
  }
  let testsInfo = testsResponse.data;

  testsInfo.forEach((test) => {
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
    sectionBody.forEach((element) => {
      let elementBlock = document.createElement("div");
      elementBlock.classList.add("section-dropdown__item");
      let checkbox = document.createElement("input");
      checkbox.classList.add("test-check-box");
      checkbox.type = "checkbox";

      let elementBlockLink = document.createElement("a");
      // (elementBlockLink.href = `${importConfig.client_url}/testPage.html?testId=${element.testId}&name=${element.name}&subject=${element.subject}`),
      elementBlockLink.innerText = element.name;
      elementBlock.appendChild(checkbox);
      elementBlock.appendChild(elementBlockLink);
      sectionBodyBlock.appendChild(elementBlock);

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
