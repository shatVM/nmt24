import * as impPopups from "./popups.js";
import * as impSubject200 from "../convert200.js";
import * as impHttp from "../http/api-router.js";
import * as importConfig from "../dev/config.js";

export function createUserBlockAdm(
  block,
  testInfo,
  userResultsArray,
  userId = null,
  group = null,
  subgroup = null,
  subject = null,
  variant = null,
  passDate = null,
  mark = null,
) {
  let userInfo = userResultsArray;

  userInfo = userResultsArray.filter((item) => {
    return (
      (userId == null || item.userid == userId) &&
      (group == null || item.group == group) &&
      (subgroup == null || item.subgroup == subgroup) &&
      (subject == null || item.subject == subject) &&
      (variant == null || item.variant === variant) &&
      (mark == null || item.mark == mark)
    );
  });

  if (passDate) {
    userInfo = userInfo.filter((item) => {
      return (
        new Date(item.passDate).setHours(0, 0, 0, 0) ==
        new Date(passDate).setHours(0, 0, 0, 0)
      );
    });
  }

  userInfo.forEach((testResult) => {
    block.appendChild(createSubjectResultBlock(testInfo, testResult, true));
  });
}

export function createUserBlock(
  block,
  testInfo,
  userResultsArray,
  userId = null,
  group = null,
  subgroup = null,
  subject = null,
  variant = null,
  passDate = null,
  mark = null,
) {
  let userInfo = userResultsArray;

  userInfo = userResultsArray.filter((item) => {
    return (
      (userId == null || item.userid == userId) &&
      (group == null || item.group == group) &&
      (subgroup == null || item.subgroup == subgroup) &&
      (subject == null || item.subject == subject) &&
      (variant == null || item.variant === variant) &&
      (mark == null || item.mark == mark)
    );
  });

  //console.log("userInfo", userInfo);


  if (passDate) {
    userInfo = userInfo.filter((item) => {
      return (
        new Date(item.passDate).setHours(0, 0, 0, 0) ==
        new Date(passDate).setHours(0, 0, 0, 0)
      );
    });
  }

  userInfo = userInfo.sort((a, b) => {
    return b.passDate - a.passDate;
  });

  userInfo.forEach((testResult) => {
    block.appendChild(createSubjectResultBlock(testInfo, testResult));
  });
}

export function createSubjectResultBlock(
  testInfo,
  testResult,
  isAdmin = false
) {
  //let username = testResult.username;
  let subjectId = testResult.subject;
  let answersObj = testResult.answersArray;
  let score = testResult.testScore;
  //let generalScore = testResult.generalAnswers;
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

  for (const key in impSubject200.mark12) {
    if (nmt200 == "Не склав") {
      nmt12 = 3;
    } else if (nmt200 < key) {
      nmt12 = impSubject200.mark12[key] - 1;
      //console.log("nmt12 значення:", nmt12);
      break;
    }
  }

  if (nmt12 !== null) {
    //console.log("Відповідне значення:", nmt12);
  } else {
    nmt12 = 1;
    //console.log("Значення не знайдено.");
  }

  //Для інформатики
  if (subjectId == 8){   
    nmt12 = testResult.testScore / testResult.generalAnswers * 10;
    nmt12 = Math.round(nmt12 );
    nmt200 = "";    
  }

  //console.log(testResult)
  let subjectElement = document.createElement("div");
  subjectElement.classList.add("user-results__item", "result-item");
  subjectElement.innerHTML = `
    <div class="result-item__info">
    ${isAdmin ? "<input type='checkbox' class='delete-check-box test-check-box'>" : ""}
      <h2 class="result-item__name">${testResult.username} ${testResult.group} ${testResult.subgroup}</h2>
      <h3 class="result-item__title">${setSubjectNameBySubject(+testResult.subject)}  
    <span class="result-item__test-name"><b><a class="aTagToDocument" target="_blank" href=${isAdmin ? "https://docs.google.com/document/d/" + testResult.testId : "#"
    }>${testInfo.find((obj) => obj.testId === testResult.testId).name.split(" ")[2]
    }</a></b></span>    
      </h3>      
      <span class="result-item__date">Дата: ${formatMillisecondsToDateTime(testResult.passDate).formattedDateTime
    }</span>
      <p class="result-item__score">   
          <span>Відповіді: </span>  
          <span class="user-score"><b>${testResult.testScore}</b></span> з
          <span class="general-score"><b>${testResult.generalAnswers}</b></span>
          ${nmt200 ? `НМТ: <b>${nmt200}</b>` : ""}       
          Оцінка: <b>${nmt12}</b> 
        </p>
        ${isAdmin ? "<button class='admin-page__delete'>Видалити</button>" : ""}
    </div>  
    <div class="result-item__answers answers-block"></div>
    `;

  let deleteButton = subjectElement.querySelector(".admin-page__delete");
  if (deleteButton) {
    if (isAdmin) {
      deleteButton.addEventListener("click", async function () {
        let main = document.querySelector("main");
        let popupText = `
          Видалити відповідь з ID <b> ${testResult._id
          } - ${setSubjectNameBySubject(+subjectId)}</b> користувача: <b>${testResult.username
          }</b>
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
    } else {
      deleteButton.remove();
    }
  }

  let scoreBlock = subjectElement.querySelector(".result-item__score");
  if (scoreBlock) {
    scoreBlock.addEventListener("click", function () {
      subjectElement.classList.toggle("active");

      let corectAnswersArray = testInfo?.filter(
        (obj) => obj.testId === testResult.testId
      );

      corectAnswersArray = JSON.parse(corectAnswersArray[0].questions);

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

      //console.log("CAArray ", CAArray);

      let answersBlock = subjectElement.querySelector(".answers-block");
      if (!answersBlock) {
        return;
      }
      answersBlock.innerHTML = "";
      answersObj.forEach((answerObj, index) => {
        let element = document.createElement("div");
        element.classList.add("answers-block__answer");
        element.innerHTML = `
          <p class="test-body__task-number">Завдання: ${answerObj.question + 1
          }</p>
          <div class = 'test-body__task-question'>
          Переглянути запитання
          </div>
          <div>
            <span>Отримана відповідь: </span><span class = 'answers'></span><br>
            <span>Правильна відповідь: </span><span class = 'correct-answers'></span>
          </div>           
          `;

        let showQuestionButton = element.querySelector(
          ".test-body__task-question"
        );
        if (showQuestionButton && importConfig.showQuestion) {
          showQuestionButton.addEventListener("click", function () {
            showQuestionButton.classList.toggle("active");
            if (showQuestionButton.classList.contains("active")) {
              showQuestionButton.innerHTML = tasksArray[answerObj.question];
            } else {
              showQuestionButton.innerHTML = "Переглянут запитання";
            }
          });
        } else {
          showQuestionButton.innerHTML = "Перегляд запитаннь заблоковано";
        }

        let answersElement = element.querySelector(".answers");
        let correctAnswers = CAArray[answerObj.question];

        if (subjectId == 3) {
          answerObj.answer = translateAnswers(answerObj.answer, "eng");
          correctAnswers = translateAnswers(correctAnswers, "eng");
        }
        //console.log('showUserAnswersInProfile ', importConfig.showUserAnswers);
        answerObj.answer.forEach((answer, index) => {
          let correctAnswerElement = correctAnswers[index];


          if (importConfig.showUserAnswers == 0) {
            answersElement.innerHTML += `<b > 🔐</b>`;
          } else {
            if (answer != correctAnswerElement) {
              answersElement.innerHTML += `<b class = "answer_wrong"> ${answer ? answer : "🤡"
                }</b>`;
            } else {
              answersElement.innerHTML += `<b > ${answer}</b>`;
            }

          }
        });

        //});
        // answersBlock.appendChild(element);

        //Створення блоку привильних відповідей
        let corectAnswersElement = element.querySelector(".correct-answers");
        //console.log(corectAnswersArray[answerObj.question])
        //let correctAnswers = CAArray[answerObj.question];
        if (correctAnswers) {
          // if (subjectId == 3) {
          //   correctAnswers = translateAnswers(correctAnswers, "eng");
          // }
          correctAnswers.forEach((e) => {
            if (importConfig.showCorrectAnswers) {
              corectAnswersElement.innerHTML += `<b> ${e}</b>`;
            } else {
              corectAnswersElement.innerHTML += `<b> 🔐</b>`;
            }
          });

          answersBlock.appendChild(element);
        }
        if (answersElement.innerText != corectAnswersElement.innerText) {
          // answersElement.classList.add("answer_wrong");
        }
      });
    });
  }

  return subjectElement;
}

export function setSubjectNameBySubject(subjectCode) {
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

  // Отримаємо години і хвилин
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
  var formattedDate = day + "." + month + "." + year;

  // Повертаємо отриману дату та час
  return { formattedDateTime, formattedDate };
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
