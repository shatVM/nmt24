const urlParams = new URLSearchParams(window.location.search);

// Получение значения параметра 'testId'
const testIdParam = urlParams.get("testId");

// запит до бази за тестом

let testInfo = {};

startTestWaiter();

function startTestWaiter() {
  let startTestButton = document.querySelector(".start-test-button");
  if (!startTestButton) {
    return console.error("Cannot find a required html code");
  }
  startTestButton.addEventListener("click", function (e) {
    e.preventDefault();
    let err = validateForm();
    if (err > 0) {
      alert("Перевірте правильність вводу даних");
      return;
    }
    startTest(testInfo);
  });
}

function startTest(testInfo) {
  let testPageMain = document.querySelector(".test-page__main");
  testPageMain.innerHTML = "тест розпочато";
}

function validateForm() {
  const pattern = /^[a-zA-Zа-яА-Я\s]+$/;
  let err = 0;
  let form = document.querySelector(".start-test-form");
  let inputname = form.querySelector("#name-input").value;
  let inputgroup = form.querySelector("#group-input").value;
  console.log(inputgroup, inputname);
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

  return err;
}
