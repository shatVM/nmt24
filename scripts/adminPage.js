import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";
import * as impSubject200 from "./convert200.js";

adminLogin();

async function adminLogin() {
  let loginForm = document.querySelector(".admin-page__login");
  if (!loginForm) return;
  let authResponse = await impHttp.isAuth();
  if (authResponse.status == 200) {
    loginForm.remove();
    adminPage();
  } else {
    let button = loginForm.querySelector(".admin-page__login-submit");
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      let email = document.querySelector(".admin-page-email").value;
      let password = document.querySelector(".admin-page-password").value;
      let loginResponse = await impHttp.login(email, password);
      if (loginResponse.status == 200) {
        loginForm.remove();
        adminPage();
      }
    });
  }
}

async function adminPage() {
  let usersInfo = await getUsersInformation();
  showAllUsers(usersInfo);
  await createSelectButton(usersInfo);
}

function showAllUsers(usersInfo) {
  usersInfo = usersInfo.sort();
  let resultsBlock = document.querySelector(".admin-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  // resultsBlock.innerHTML = "";
  const uniqueUsernames = new Set(usersInfo.map((item) => item.username));
  const uniqueUsernamesArray = Array.from(uniqueUsernames).sort();

  uniqueUsernamesArray.forEach((username) => {
    let userInfo = usersInfo.filter((item) => {
      return item.username == username;
    });
    console.log(username + ":");
    console.log(userInfo);
    let generalUserElement = document.createElement("div");
    generalUserElement.classList.add("general-user-block");
    resultsBlock.appendChild(generalUserElement);
    let userBlock = createUserBlock(generalUserElement, userInfo);
    if (userBlock) {
      generalUserElement.appendChild(
        createUserBlock(generalUserElement, userInfo)
      );
    }

    // userInfo.forEach((userResult) => {
    //   // console.log(userResult);
    // });
  });
}

async function createSelectButton(usersInfo) {
  let select = document.querySelector(".admin-page__select");
  if (!select) {
    return;
  }
  const uniqueUsernames = new Set(usersInfo.map((item) => item.username));
  const uniqueUsernamesArray = Array.from(uniqueUsernames).sort();

  uniqueUsernamesArray.forEach((username) => {
    let option = document.createElement("option");
    option.setAttribute("value", username);
    option.innerHTML = username;
    select.appendChild(option);
  });

  select.addEventListener("change", function (e) {
    let selectedOption = select.options[select.selectedIndex];
    let value = selectedOption.value;
    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    createUserBlock(resultsBlock, usersInfo, value);
  });
}

async function getUsersInformation() {
  let usersInfoResponse = await impHttp.getUserAnswers();
  if (usersInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + usersInfoResponse.data.message);
  }
  return usersInfoResponse.data;
}

function createUserBlock(block, generalArray, username) {
  let userInfo = generalArray;
  if (username) {
    userInfo = generalArray.filter((item) => {
      return item.username == username;
    });
  }

  userInfo.forEach((testResult) => {
    block.appendChild(createSubjectResultBlock(testResult));
  });
}

function createSubjectResultBlock(testResult) {
  let username = testResult.username;
  let subjectId = testResult.subject;
  let answersObj = testResult.answersArray;
  let score = testResult.testScore;
  let generalScore = testResult.generalAnswers;
  if (answersObj) {
    answersObj = JSON.parse(answersObj);
  }

  let subjectName = impSubject200.subjects200[subjectId];
  //Переведення в 200
  let nmt = impSubject200[subjectName][score];
  let nmt200;
  if (nmt) {
    nmt200 = nmt;
  } else {
    nmt200 = "Не склав";
  }

  for (var i = 0; i < 12; i++) {
    if (nmt200 <= impSubject200.mark12[i]) {
      console.log(impSubject200.mark12[i][i]);
    }
  }

  let subjectElement = document.createElement("div");
  subjectElement.classList.add("admin-results__item", "result-item");
  subjectElement.innerHTML = `
  <p class="result-item__name">${username}</p>
  <h3 class="result-item__title">Предмет: ${setSubjectNameBySubject(
    +subjectId
  )}</h3>
  <p class="result-item__score">
    <span class="user-score">${score}</span> з
    <span class="general-score">${generalScore}</span>
    НМТ: ${nmt200}
  </p>
  <div class="result-item__answers answers-block">
  </div>
  `;
  // block.appendChild(subjectElement);

  let scoreBlock = subjectElement.querySelector(".result-item__score");
  if (scoreBlock) {
    scoreBlock.addEventListener("click", function () {
      subjectElement.classList.toggle("active");
    });
  }

  let answersBlock = subjectElement.querySelector(".answers-block");
  answersObj.forEach((answerObj) => {
    let element = document.createElement("div");
    element.classList.add("answers-block__answer");
    element.innerHTML = `
    <p>Питання: ${answerObj.question + 1}</p>
    <p class = 'answers' >Відповідь користувача:</p>
   
    `;
    // <p>✔️Правильна відповідь: А В Г Б</p>
    // <p>Кількість балів: 1</p>
    // <div class="answers-block__answer-text">
    //   <div class="answers-block__answer-title">
    //     Текст питання
    //   </div>
    //   <div class="answers-block__answer-main">
    //     скільки секунд в 1 годині
    //   </div>
    // </div>
    let answersElement = element.querySelector(".answers");
    answerObj.answer.forEach((answer) => {
      answersElement.innerHTML += ` ${answer}`;
    });
    answersBlock.appendChild(element);
  });
  return subjectElement;
}

function setSubjectNameBySubject(subjectCode) {
  let subject = "";
  switch (+subjectCode) {
    case 0:
      subject = "Історія України";
      break;
    case 1:
      subject = "Математика";
      break;
    case 2:
      subject = "Українська мова";
      break;
    case 3:
      subject = "Англійська мова";
      break;
    case 4:
      subject = "Фізика";
      break;
    case 5:
      subject = "Хімія";
      break;
    case 6:
      subject = "Біологія";
      break;
    case 7:
      subject = "Географія";
      break;
    case 8:
      subject = "Інформатика";
      break;
    case 9:
      subject = "Українська література";
      break;
  }

  return subject;
}
