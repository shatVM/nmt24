import * as importFile from "./components/dropdown.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";

const testMenu = document.querySelector(".main-page__tests-menu");
createMainPage();
async function createMainPage() {
  let testsResponse = await impHttp.getTests();
  if (testsResponse.status != 200) {
    return alert("Спробуйте оновити сторінку, помилка при отриманні даних");
  }
  let testsInfo = testsResponse.data;
  console.log(testsInfo);
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

      let elementBlockLink = document.createElement("a");
      (elementBlockLink.href = `${importConfig.client_url}/testPage.html?testId=${element.testId}&name=${element.name}&subject=${element.subject}`),
        (elementBlockLink.innerText = element.name);
      elementBlock.appendChild(elementBlockLink);
      sectionBodyBlock.appendChild(elementBlock);
    });

    //// збір елемента
    section.appendChild(sectionTitle);
    section.appendChild(sectionBodyBlock);
    importFile.dropdownMenu(section);

    testMenu.appendChild(section);
  });
}
