import * as importConfig from "../dev/config.js";
import * as impHttp from "../http/api-router.js";
import * as impPopups from "../components/popups.js";
import * as impSubject200 from "../convert200.js";

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

async function getUsersInformation() {
  let usersInfoResponse = await impHttp.getAllUserAnswers();
  if (usersInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + usersInfoResponse.data.message);
  }
  return usersInfoResponse.data;
}

async function getTestsInformation() {
  let testsInfoResponse = await impHttp.getAllTestsFromDB();
  if (testsInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + testsInfoResponse.data.message);
  }
  return testsInfoResponse.data;
}

let testsInfo = await getTestsInformation();
//console.log("testsInfo ", testsInfo);

async function adminPage() {
  let usersInfo = await getUsersInformation();
  //console.log('usersInfo ',usersInfo)
  showAllUsers(usersInfo);
  await createSelectButton(usersInfo);
}

function showAllUsers(usersInfo) {
  usersInfo = usersInfo.sort();
  let resultsBlock = document.querySelector(".admin-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  const uniqueUsernames = new Set(usersInfo.map((item) => item.username));
  const uniqueUsernamesArray = Array.from(uniqueUsernames).sort();

  uniqueUsernamesArray.forEach((username) => {
    let userInfo = usersInfo.filter((item) => {
      return item.username == username;
    });
    let generalUserElement = document.createElement("div");
    generalUserElement.classList.add("general-user-block");
    resultsBlock.appendChild(generalUserElement);
    let userBlock = createUserBlock(generalUserElement, userInfo);
    if (userBlock) {
      generalUserElement.appendChild(
        createUserBlock(generalUserElement, userInfo)
      );
    }
  });
}

async function createSelectButton(usersInfo) {
  //Вибір Предмету
  let selectSubject = document.querySelector(".admin-page__selectSubject");
  if (!selectSubject) {
    return;
  }

  const uniqueSubject = new Set(usersInfo.map((item) => item.subject));
  const subjectArray = Array.from(uniqueSubject).sort();

  subjectArray.forEach((subjectCode) => {
    let subject = setSubjectNameBySubject(subjectCode);

    let option = document.createElement("option");
    option.setAttribute("value", subjectCode);
    option.innerHTML = subject;
    selectSubject.appendChild(option);
  });

  selectSubject.addEventListener("change", function (e) {
    let selectedOption = selectSubject.options[selectSubject.selectedIndex];
    let subject = selectedOption.value;
    if (subject == "null") {
      subject = null;
    }
    selectSubject.setAttribute("value", subject);
    // перевіряємо інші чекбокси
    let student = document
      .querySelector(".admin-page__selectStudent")
      ?.getAttribute("value");
    if (student && student == "null") {
      student = null;
    }

    // виводимо інформацію
    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";

    createUserBlock(
      resultsBlock,
      usersInfo,
      student,
      null,
      JSON.parse(subject)
    );
  });

  //Вибір Групи
  // let selectGroup = document.querySelector(".admin-page__selectGroup");
  // if(!selectGroup){
  //   return
  // }
  // const uniqueGroup = new Set(usersInfo.map((item) => item.group));
  // console.log(uniqueGroup);
  // uniqueGroup.forEach((GroupCode) => {
  //   let subject =  setSubjectNameBySubject(subjectCode)
  //   let option = document.createElement("option");
  //   option.setAttribute("value", subjectCode);
  //   option.innerHTML = subject;
  //   select1.appendChild(option);
  // });

  // select1.addEventListener("change", function (e) {
  //   let selectedOption = select.options[select.selectedIndex];
  //   let value = selectedOption.value;
  //   let resultsBlock = document.querySelector(".admin-results");
  //   if (!resultsBlock) {
  //     return alert("Помилка! Блок результатів не знайдено");
  //   }
  //   resultsBlock.innerHTML = "";
  //   createUserBlockBySubject(resultsBlock, usersInfo, value);
  // });

  //Вибір студента
  let studentSelect = document.querySelector(".admin-page__selectStudent");
  if (!studentSelect) {
    return;
  }
  const uniqueUsernames = new Set(usersInfo.map((item) => item.username));
  const uniqueUsernamesArray = Array.from(uniqueUsernames).sort();

  uniqueUsernamesArray.forEach((username) => {
    let option = document.createElement("option");
    option.setAttribute("value", username);
    option.innerHTML = username;
    studentSelect.appendChild(option);
  });

  studentSelect.addEventListener("change", function (e) {
    let selectedOption = studentSelect.options[studentSelect.selectedIndex];
    let student = selectedOption.value;
    if (student == "null") {
      student = null;
    }
    studentSelect.setAttribute("value", student);
    // перевіряємо інші чекбокси
    let subject = document
      .querySelector(".admin-page__selectSubject")
      ?.getAttribute("value");
    if (subject && subject == "null") {
      subject = null;
    }
    // виводимо інформацію

    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    createUserBlock(resultsBlock, usersInfo, student, null, subject);
  });
}

function createUserBlock(
  block,
  generalArray,
  username = null,
  group = null,
  subject = null
) {
  //console.log(username, group, subject);
  let userInfo = generalArray;

  userInfo = generalArray.filter((item) => {
    return (
      (username == null || item.username == username) &&
      (group == null || item.group == group) &&
      (subject == null || item.subject == subject)
    );
  });

  userInfo = userInfo.sort();

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
  //console.log("nmt значення:", nmt);
  let nmt200;
  if (nmt) {
    nmt200 = nmt;
  } else {
    nmt200 = "Не склав";
  }

  //Переведення в 12
  let nmt12 = null;

  // for (var i = 0; i < 12; i++) {
  //   if (nmt200 <= impSubject200.mark12[i]) {
  // nmt12
  //     console.log(impSubject200.mark12[i][i]);
  //   }
  // }

  for (const key in impSubject200.mark12) {
    //console.log("key:", key);
    //console.log("nmt значення:", nmt);
    if (nmt200 == "Не склав") {
      nmt12 = 3;
    } else if (nmt200 < key) {
      nmt12 = impSubject200.mark12[key] - 1;
      //console.log("nmt12 значення:", nmt12);
      break;
    }
  }

  // if (nmt12 !== null) {
  //   //console.log("Відповідне значення:", nmt12);
  // } else {
  //   nmt12 = 1
  //   //console.log("Значення не знайдено.");
  // }

  let subjectElement = document.createElement("div");
  subjectElement.classList.add("admin-results__item", "result-item");
  subjectElement.innerHTML = `
  <h2 class="result-item__name">${username}</h2>
  <div class="result-item__info>
    <h3 class="result-item__title">${setSubjectNameBySubject(+subjectId)} </h3>
    <span class="result-item__test-name"><b><a class="aTagToDocument" href="https://docs.google.com/document/d/${testResult.testId}" target="_blanc"> ${testsInfo
      .find((obj) => obj.testId === testResult.testId)
      .name.split(" ")[2]
    }</a></b></span>
    <span class="result-item__date">Дата: ${formatMillisecondsToDateTime(
      testResult.passDate
    )}</span>

  </div>
  <!--<p class="result-item__id">ID: ${testResult._id}</p>--!>
 

  <p class="result-item__score">
    <span>Відповіді: </span>  
    <span class="user-score"><b>${score}</b></span> з
    <span class="general-score"><b>${generalScore}</b></span>
    НМТ: <b>${nmt200}</b> Оцінка: <b>${nmt12}</b>
  </p>
  <div class="result-item__answers answers-block">
  </div>
  <button class="admin-page__delete">Видалити</button>
  `;

  let deleteButton = subjectElement.querySelector(".admin-page__delete");
  if (deleteButton) {
    deleteButton.addEventListener("click", async function () {
      let main = document.querySelector("main");

      let popupText = `
      Видалити відповідь з ID <b> ${testResult._id} - ${setSubjectNameBySubject(
        +subjectId
      )}</b> користувача: <b>${testResult.username}</b>
      `;

      let popupObj = impPopups.yesNoPopup(popupText);
      main.appendChild(popupObj.popup);
      let yesButton = popupObj.yesButton;
      yesButton.addEventListener("click", async function (e) {
        e.preventDefault();
        popupObj.popup.remove();
        let deleteResponse = await impHttp.deleteUserAnswer(testResult._id);
        if (deleteResponse.status == 200) {
          subjectElement.remove();
        } else {
          alert("Помилка видалення відповіді!");
        }
      });
      let noButton = popupObj.noButton;
      noButton.addEventListener("click", async function (e) {
        e.preventDefault();
        popupObj.popup.remove();
      });
    });
  }

  let scoreBlock = subjectElement.querySelector(".result-item__score");
  if (scoreBlock) {
    scoreBlock.addEventListener("click", function () {
      subjectElement.classList.toggle("active");
    });
  }



  let corectAnswersArray = testsInfo.filter(
    (obj) => obj.testId === testResult.testId
  );
  //console.log('corectAnswersArray ',corectAnswersArray)

  corectAnswersArray = JSON.parse(corectAnswersArray[0].questions);
  //console.log("corectAnswersArray ", corectAnswersArray);

  //Масив запитань
  let tasksArray = [];
  corectAnswersArray.forEach((e) => {
    tasksArray.push(e.body);
  });


  //Масив правильних відповідей
  let CAArray = [];
  corectAnswersArray.forEach((e) => {
    CAArray.push(e.correctAnswers);
  });

  // console.log("CAArray ", CAArray);

  let answersBlock = subjectElement.querySelector(".answers-block");

  answersObj.forEach((answerObj,index) => {
    let element = document.createElement("div");
    element.classList.add("answers-block__answer");
    element.innerHTML = `
    <p class="test-body__task-number">Завдання: ${answerObj.question + 1}</p>
    <div class="task-item">${tasksArray[answerObj.question]}<div>  
    <span>Відповідь учня: </span><span class = 'answers' ></span><br>
    <span>Відповідь вірна </span><span class = 'corecrt-answers'></span>  
    
    `;

    // let tasksElement = subjectElement.querySelector(".result-item__answers");
    // //console.log(tasksElement)
    // let taskElement = tasksElement.querySelector(".answers-block__answer");
    // //console.log(taskElement)
    // //taskElement.classList.add("admin-results__item", "result-item");
    // if (taskElement) {
    //   let taskNumberBlock = taskElement.querySelector(".test-body__task-number");
    //   //console.log(taskNumberBlock)
    //   if (taskNumberBlock) {
    //     taskNumberBlock.addEventListener("click", function () {
    //       console.log(2222)
    //       //taskElement[answerObj.question].innerHTML += ``
    //       //taskElement[answerObj.question].classList.toggle("active");
    //     });
    //   }
    // }



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
    if (subjectId == 3) {
      answerObj.answer = translateAnswers(answerObj.answer, "eng");
    }
    answerObj.answer.forEach((answer, index) => {
      answersElement.innerHTML += `<b> ${answer}</b>`;
      // console.log("CAArray ", CAArray[answerObj?.question][index], answer)
      //console.log(index)

      if (answer != CAArray[answerObj.question]) {
        // answersElement.classList.add("answer_wrong");
      }
    });
    answersBlock.appendChild(element);

    //Створення блоку привильних відповідей
    let corectAnswersElement = element.querySelector(".corecrt-answers");
    //console.log(corectAnswersArray[answerObj.question])
    let correctAnswers = CAArray[answerObj.question];
    if (correctAnswers) {
      if (subjectId == 3) {
        correctAnswers = translateAnswers(correctAnswers, "eng");
      }
      //console.log("CAArray ",CAArray)
      // console.log(
      //   testsInfo
      //     .find((obj) => obj.testId === testResult.testId)
      //     .name
      // )
      CAArray[answerObj.question].forEach((e) => {
        corectAnswersElement.innerHTML += `<b> ${e}</b>`;
      })


      // corectAnswersElement.innerHTML += `<b> ${
      //   CAArray[answerObj.question]
      // }</b>`;
      answersBlock.appendChild(element);
    }
    if (answersElement.innerText != corectAnswersElement.innerText) {
      answersElement.classList.add("answer_wrong");
    }
    //Створення блоку запитання
    let questionElement = element.querySelector(".corecrt-answers");

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

function formatMillisecondsToDateTime(milliseconds) {
  // Створимо новий об'єкт Date, передавши йому кількість мілісекунд
  var date = new Date(milliseconds);

  // Отримаємо день, місяць і рік
  var day = date.getDate();
  var month = date.getMonth() + 1; // Місяці в JavaScript починаються з 0, тому потрібно додати 1
  var year = date.getFullYear();

  // Отримаємо години і хвилини
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Додамо нуль перед днем, місяцем, годинами і хвилинами, якщо вони менше 10
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  // Форматуємо дату та час у вигляді "дд.мм.рррр гг:хв"
  var formattedDateTime =
    day + "." + month + "." + year + " " + hours + ":" + minutes;

  // Повертаємо отриману дату та час
  return formattedDateTime;
}

function translateAnswers(answersArray, lang) {
  if (lang == "eng") {
    answersArray.forEach((answer, i) => {
      switch (answer) {
        case "А":
          answersArray[i] = "A";
          break;
        case "Б":
          answersArray[i] = "B";
          break;
        case "В":
          answersArray[i] = "C";
          break;
        case "Г":
          answersArray[i] = "D";
          break;
        case "Д":
          answersArray[i] = "E";
          break;
        case "Е":
          answersArray[i] = "F";
          break;
        case "Є":
          answersArray[i] = "G";
          break;
        case "Ж":
          answersArray[i] = "H";
          break;
      }
    });
  } else if (lang == "ua") {
    answersArray.forEach((answer, i) => {
      switch (answer) {
        case "A":
          answersArray[i] = "А";
          break;
        case "B":
          answersArray[i] = "Б";
          break;
        case "C":
          answersArray[i] = "В";
          break;
        case "D":
          answersArray[i] = "Г";
          break;
        case "E":
          answersArray[i] = "Д";
          break;
        case "F":
          answersArray[i] = "Е";
          break;
        case "G":
          answersArray[i] = "Є";
          break;
        case "H":
          answersArray[i] = "Ж";
          break;
      }
    });
  }

  return answersArray;
}
