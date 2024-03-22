import * as importFile from "./components/dropdown.js";

const testMenu = document.querySelector(".main-page__tests-menu");
// берем інфо з бази
let testsInfo = [
  {
    subject: "Математика",
    body: [
      {
        id: "16473853dnjr",
        name: "Варіант 1 - збірник Авраменко 2017",
      },
      {
        id: "16473542ldk",
        name: "Варіант 2 - збірник Авраменко 2017",
      },
      {
        id: "16879973dnjr",
        name: "Варіант 1 - збірник Авраменко 2020",
      },
      {
        id: "19230843lsrj",
        name: "Варіант 4 - збірник Авраменко 2021",
      },
      {
        id: "19230843lsrj",
        name: "Варіант 4 - збірник Авраменко 2021",
      },
    ],
  },
  {
    subject: "Українська мова",
    body: [
      {
        id: "16473853dnjr",
        name: "Варіант 1 - збірник Авраменко 2017",
      },
      {
        id: "16473542ldk",
        name: "Варіант 2 - збірник Авраменко 2017",
      },
      {
        id: "16879973dnjr",
        name: "Варіант 1 - збірник Авраменко 2020",
      },
      {
        id: "19230843lsrj",
        name: "Варіант 4 - збірник Авраменко 2021",
      },
    ],
  },
];

testsInfo.forEach((test) => {
  let subject = test.subject;
  let sectionBody = test.body;

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
    (elementBlockLink.href = `http://127.0.0.1:5500/testPage.html?testId=${element.id}`),
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
