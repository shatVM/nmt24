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
  let testsInfo = await getTestsInformation();
  //console.log('testsInfo ', testsInfo)
  showAllTests(testsInfo);
  await createSelectButton(testsInfo);
}

async function getTestsInformation() {
  let testsInfoResponse = await impHttp.getAllTestsFromDB();
  if (testsInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + testsInfoResponse.data.message);
  }
  return testsInfoResponse.data;
}

function showAllTests(testsInfo) {
  testsInfo = testsInfo.sort();
  let resultsBlock = document.querySelector(".admin-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  const uniqueTestNames = new Set(testsInfo.map((item) => item.subject));
  const testsNamesArray = Array.from(uniqueTestNames).sort();
  //console.log(testsNamesArray)
  //console.log('testsNamesArray ', testsNamesArray)

  testsNamesArray.forEach((subject) => {
    let testInfo = testsInfo.filter((item) => {
      return item.subject == subject;
    });

    let generalTestElement = document.createElement("div");
    generalTestElement.classList.add("general-user-block");
    resultsBlock.appendChild(generalTestElement);
    //let testBlock = createTestBlock(generalTestElement, testInfo);
    let testBlock = createTestBlockBySubject(generalTestElement, testInfo);

    //let testBlock = createTestBlockBySubject(resultsBlock, testInfo);

  });
}

//Фільтрація предмету тестування
async function createSelectButton(testsInfo) {
  //Вибір Предмету
  let selectSubject = document.querySelector(".admin-page__selectSubject");
  if (!selectSubject) {
    return
  }
  const uniqueSubject = new Set(testsInfo.map((item) => item.subject));
  const subjectArray = Array.from(uniqueSubject).sort();

  subjectArray.forEach((subjectCode) => {
    let subject = setSubjectNameBySubject(subjectCode)
    let option = document.createElement("option");
    option.setAttribute("value", subjectCode);
    option.innerHTML = subject;
    selectSubject.appendChild(option);
  });

  selectSubject.addEventListener("change", function (e) {
    let selectedSubjectOption = selectSubject.options[selectSubject.selectedIndex];
    let subject = selectedSubjectOption.value;

    let selectedStatusOption = selectStatusSubject.options[selectStatusSubject.selectedIndex];
    let status = selectedStatusOption.value;

    console.log('subject - ', subject)
    console.log('status - ', status)

    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    createTestBlockBySubject(resultsBlock, testsInfo, subject, status);
  });

  //Вибір статусу тесту
  let selectStatusSubject = document.querySelector(".admin-page__selectSubjectStatus");
  if (!selectStatusSubject) {
    return
  }

  selectStatusSubject.addEventListener("change", function (e) {

    let selectedSubjectOption = selectSubject.options[selectSubject.selectedIndex];
    let subject = selectedSubjectOption.value;

    let selectedStatusOption = selectStatusSubject.options[selectStatusSubject.selectedIndex];
    let status = selectedStatusOption.value;

    console.log('subject - ', subject)
    console.log('status - ', status)

    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";

    
    createTestBlockBySubject(resultsBlock, testsInfo, subject, status);
  });
}



function createTestBlockBySubject(block, generalArray, subject, status) {


  let testInfo = generalArray;
  if (subject) {
    testInfo = testInfo.filter((item) => {
      return item.subject == subject;
    });
  }

  if (status) {
    testInfo = testInfo.filter((item) => {
      return item.status == status;
    });
  }
  

  testInfo.forEach((testResult) => {
    block.appendChild(createSubjectResultBlock(testResult));
  });
}

// function createTestBlock(block, generalArray, testname) {

//   let testInfo = generalArray;
//   //console.log('testInfo',testInfo)
//   if (testname) {
//     testInfo = generalArray.filter((item) => {
//       return item.testname == testname;
//     });
//   }

//   testInfo.forEach((testResult) => {
//     block.appendChild(createSubjectResultBlock(testResult));
//   });
// }

function createSubjectResultBlock(testResult) {

  let subjectId = testResult.subject;
  let answersObj = testResult.answersArray;

  if (answersObj) {
    answersObj = JSON.parse(answersObj);
  }

  let subjectName = impSubject200.subjects200[subjectId];

  let subjectElement = document.createElement("div");
  subjectElement.classList.add("admin-results__item", "result-item");
  subjectElement.innerHTML = `
  <h2 class="result-item__name">${setSubjectNameBySubject(+subjectId)} </h2>
  <div>
    <h3 class="result-item__title"><a class="aTagToDocument" href="https://docs.google.com/document/d/${testResult.testId}" target="_blanc">${testResult.name}</a></h3>
    
  </div>

  <p class="result-item__id result-item__date">ID: ${testResult._id}</p>
  <p class="result-item__date">Завантажено: ${formatMillisecondsToDateTime(testResult.uploadDate)}</p>

  <p class="result-item__score">
    <span>Пройдено: </span>  
    <span class="user-score"><b>${subjectName}</b></span> раз
    <span class="general-score">Склали: <b>${subjectName}</b></span>
    <span class="general-score">Складність: <b>${subjectName}</b></span> 
  </p>
  <div class="result-item__answers showtest-block">
  </div>
  <button class="admin-page__change-visibility">Змінити видимість</button>
  <button class="admin-page__delete">Видалити</button>
  `;
  // block.appendChild(subjectElement);
  let deleteButton = subjectElement.querySelector(".admin-page__delete");
  if (deleteButton) {
    deleteButton.addEventListener("click", function () {
      //subjectElement.classList.toggle("active");
      let modal = confirm('Видалити ' + testResult.name + ' по ІД: ' + testResult._id)
      if (modal) {
        console.log('Видалити ', testResult.name, 'по ІД: ', testResult._id)
        alert(`Видалено!
Насправді - ні, це всього лише заглушка`)
      }
    });
  }

  let updateStatusButton = subjectElement.querySelector(".admin-page__change-visibility");
  if (updateStatusButton) {
    updateStatusButton.addEventListener("click", async function () {
      let testData = await impHttp.getTestById([testResult.testId])
      testData = testData.data

      //subjectElement.classList.toggle("active");
      let modal = confirm('Змінити статус ' + testData.name + ' по ІД: ' + testData._id)
      if (modal) {
        console.log("status", testData.status)
        console.log(testData)
        let tName = testData.name;
        let status;
        if (testData.status == false) {
          status = true;
          tName = tName.replace("⛔", "✅")
        } else {
          status = false;
          tName = tName.replace("✅", "⛔")
        }

        console.log("to update ", tName)
        await impHttp.changeDBParam(testData.testId, "status", status)
        await impHttp.changeDBParam(testData.testId, "name", tName)
        console.log(testData.testId)
        let parent = updateStatusButton.parentElement;
        await new Promise(r => setTimeout(r, 500));
        let test = await impHttp.getTestById([testData.testId])
        parent.getElementsByClassName("aTagToDocument")[0].innerHTML = test.data.name;
        console.log("from db", test.data.name)
        //parentParent.prepend(createSubjectResultBlock(test.data))
      }
    });
  }


  // let scoreBlock = subjectElement.querySelector(".result-item__score");
  // if (scoreBlock) {
  //   scoreBlock.addEventListener("click", function () {
  //     subjectElement.classList.toggle("active");
  //   });
  // }



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
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  // Форматуємо дату та час у вигляді "дд.мм.рррр гг:хв"
  var formattedDateTime = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;

  // Повертаємо отриману дату та час
  return formattedDateTime;
}