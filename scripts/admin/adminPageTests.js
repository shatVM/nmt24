import * as impPopups from "../components/popups.js";
import * as importConfig from "../dev/config.js";
import * as impHttp from "../http/api-router.js";
import * as impSubject200 from "../convert200.js";

adminLogin();

async function adminLogin() {
  let loginForm = document.querySelector(".admin-page__login");
  if (!loginForm) return;
  let authResponse = await impHttp.isAuth();
  if (authResponse.status == 200) {
    if (window?.userInfo?.roles?.includes("ADMIN")) {
      loginForm.remove();
      adminPage();
    } else {
      location.href = importConfig.client_url;
      alert("В вас немає прав адміністратора");
    }
  } else {
    let button = loginForm.querySelector(".admin-page__login-submit");
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      let errorsBlock = loginForm.querySelector("p");
      let email = document.querySelector(".admin-page-email").value;
      let password = document.querySelector(".admin-page-password").value;
      if ((!email && errorsBlock) || (!password && errorsBlock)) {
        errorsBlock.innerHTML = "Перевірте логін та пароль для входу в систему";
      }
      email = email.trim();
      password = password.trim();
      let loginResponse = await impHttp.login(email, password);
      if (loginResponse.status == 200) {
        loginForm.remove();
        adminPage();
      }
    });
  }
}

let adminCheckbox = document.querySelector("#admMode");
if (adminCheckbox) {
  adminCheckbox.addEventListener("change", function () {
    impHttp.setConfigParam("adminMode", adminCheckbox.checked);
    console.log("adminCheckbox", adminCheckbox.checked);
  });
}

let showTestFinishButton = document.querySelector("#showTestFinishButton");
if (showTestFinishButton) {
  showTestFinishButton.addEventListener("change", function () {
    impHttp.setConfigParam("showTestFinishButton", showTestFinishButton.checked);
    console.log("showTestFinishButton", showTestFinishButton.checked);
  });
}

let showCorrectAnswersInProfile = document.querySelector("#showCorrectAnswersInProfile");
if (showCorrectAnswersInProfile) {
  showCorrectAnswersInProfile.addEventListener("change", function () {
    impHttp.setConfigParam("showCorrectAnswersInProfile", showCorrectAnswersInProfile.checked);
    console.log("showCorrectAnswersInProfile", showCorrectAnswersInProfile.checked);
  }
  );
}

let selectStatus = document.querySelector("#status");
if (selectStatus) {
  selectStatus.addEventListener("change", function () {
    let selectedOption = selectStatus.options[selectStatus.selectedIndex];
    let status = selectedOption.value;
    impHttp.setConfigParam("status", status);
    console.log("status", status);
  });
}


let countOfStreams = document.querySelector("#countOfStreams");
if (countOfStreams) {
  countOfStreams.addEventListener("change", function () {
    let selectedOption = countOfStreams.options[countOfStreams.selectedIndex];
    let count = selectedOption.value;
    impHttp.setConfigParam("countOfStreams", count);
    console.log("countOfStreams", count);
  });
}


//да, я знаю шо це можлво не працює. Якщо ви знаєте як це зробити краще - виправте, будь ласка, але не видаляйте, якщо не знаєте як це зробити. Дякую.
async function loadParams() {
  let config = await impHttp.setConfigParam("id", 0);
  if (config.status == 200) {
    let params = config.config;

    adminCheckbox.checked = params.adminMode;
    showTestFinishButton.checked = params.showTestFinishButton;
    showCorrectAnswersInProfile.checked = params.showCorrectAnswersInProfile;
    selectStatus.value = params.status;
    countOfStreams.value = params.countOfStreams;
  }
}

loadParams();

let pseudoTestDescription;

fetch(importConfig.client_url + '/text.txt')
  .then(response => {
    // Check if response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Get response text
    return response.text();
  })
  .then(data => {
    // Assign the response text to the global variable
    pseudoTestDescription = data;
    // Now you can work with the globalResponseText variable
  })




async function adminPage() {
  let testsInfo = await getTestsInformation();
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
  let resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  const uniqueTestNames = new Set(testsInfo.map((item) => item.subject));
  const testsNamesArray = Array.from(uniqueTestNames).sort();

  testsNamesArray.forEach((subject) => {
    let testInfo = testsInfo.filter((item) => {
      return item.subject == subject;
    });

    let testBlock = createTestBlockBySubject(resultsBlock, testInfo);
  });
}

//Фільтрація предмету тестування
async function createSelectButton(testsInfo) {
  //Вибір Предмету
  let selectSubject = document.querySelector(".selectSubject");
  if (!selectSubject) {
    return;
  }
  const uniqueSubject = new Set(testsInfo.map((item) => item.subject));
  const subjectArray = Array.from(uniqueSubject).sort();

  subjectArray.forEach((subjectCode) => {
    let subject = setSubjectNameBySubject(subjectCode);
    let option = document.createElement("option");
    option.setAttribute("value", subjectCode);
    option.innerHTML = subject;
    selectSubject.appendChild(option);
  });

  selectSubject.addEventListener("change", function (e) {
    let selectedSubjectOption =
      selectSubject.options[selectSubject.selectedIndex];
    let subject = selectedSubjectOption.value;

    let selectedStatusOption =
      selectStatusSubject.options[selectStatusSubject.selectedIndex];
    let status = selectedStatusOption.value;

    let selectedTypeOption =
      selectTypeSubject.options[selectTypeSubject.selectedIndex];
    let type = selectedTypeOption.value;

    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    createTestBlockBySubject(resultsBlock, testsInfo, subject, status, type);

    //відображення аналітики предмету

  });

  //Вибір статусу тесту
  let selectStatusSubject = document.querySelector(
    ".admin-page__selectSubjectStatus"
  );
  if (!selectStatusSubject) {
    return;
  }

  selectStatusSubject.addEventListener("change", function (e) {
    let selectedSubjectOption =
      selectSubject.options[selectSubject.selectedIndex];
    let subject = selectedSubjectOption.value;

    let selectedStatusOption =
      selectStatusSubject.options[selectStatusSubject.selectedIndex];
    let status = selectedStatusOption.value;

    let selectedTypeOption =
      selectTypeSubject.options[selectTypeSubject.selectedIndex];
    let type = selectedTypeOption.value;

    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";

    createTestBlockBySubject(resultsBlock, testsInfo, subject, status, type);
  });

  //Вибір типу тесту
  let selectTypeSubject = document.querySelector(
    ".admin-page__selectSubjectType"
  );
  if (!selectTypeSubject) {
    return;
  }

  selectTypeSubject.addEventListener("change", function (e) {
    let selectedSubjectOption =
      selectSubject.options[selectSubject.selectedIndex];
    let subject = selectedSubjectOption.value;

    let selectedStatusOption =
      selectStatusSubject.options[selectStatusSubject.selectedIndex];
    let status = selectedStatusOption.value;

    let selectedTypeOption =
      selectTypeSubject.options[selectTypeSubject.selectedIndex];
    let type = selectedTypeOption.value;


    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";

    createTestBlockBySubject(resultsBlock, testsInfo, subject, status, type);
  });
}



function createTestBlockBySubject(block, generalArray, subject, status, type) {
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

  if (type) {
    testInfo = testInfo.filter((item) => {
      return item.type == type;
    });
  }

  testInfo.forEach((testResult) => {
    block.appendChild(createSubjectResultBlock(testResult));
  });
}

function createSubjectResultBlock(testResult) {
  let subjectId = testResult.subject;
  let answersObj = testResult.answersArray;

  if (answersObj) {
    answersObj = JSON.parse(answersObj);
  }

  let subjectName = impSubject200.subjects200[subjectId];
  let description = testResult.description;
  if (description == "") {
    description = "<i>Опис відсутній</i>";
  }
  let subjectElement = document.createElement("div");
  subjectElement.classList.add("user-results__item", "result-item");
  subjectElement.innerHTML = `
  <!--<h2 class="result-item__name">${setSubjectNameBySubject(
    +subjectId
  )} </h2>-->
  <div class="result-item__info">
  <div class="image-container">
  <img src="img/visibility.png" alt="test-passed" class="admin-page__change-visibility header__img" /> 
  </div>
    <h3 class="result-item__name"><a class="aTagToDocument" href="https://docs.google.com/document/d/${testResult.testId
    }" target="_blanc">${testResult.name}</a></h3>
     <p class="result-item__date">${formatMillisecondsToDateTime(
      testResult.uploadDate
    )}</p>
    <span class="short-description">${description}</span>
    <div class="full-description">
      <textarea class="description-textarea" name="description">${description}</textarea>
      <br />
      <button class="admin-page__change-description">Змінити опис</button>
    </div>   
  <!-- 
    <p class="result-item__score">
      <span>Пройдено: </span>  
      <span class="user-score"><b>0</b></span> раз
      <span class="general-score">Склали: <b>0</b></span>
      <span class="general-score">Складність: <b>0</b></span> 
    </p>
  -->
  
  <button class="admin-page__delete">Видалити</button>
  

  </div>

  <!--<p class="result-item__id result-item__date">ID: ${testResult._id
    }</p> <div class="result-item__answers showtest-block">
  <!--<p class="result-item__id result-item__date">ID: ${testResult._id
    }</p> <div class="result-item__answers showtest-block">
  </div>-->
 

  
  
  
  `;

  let changeDescriptionButton = subjectElement.querySelector(".admin-page__change-description");
  if (changeDescriptionButton) {
    changeDescriptionButton.addEventListener("click", async function () {
      //subjectElement.classList.toggle("active");
      let descriptionElement = subjectElement.querySelector(".description-textarea");
      changeDescriptionButton.setAttribute("disabled", "disabled");
      await impHttp.changeDBParam(testResult.testId, "description", descriptionElement.value);
      await impHttp.setDocumentParam(testResult.testId, "description", descriptionElement.value);
      subjectElement.querySelector(".short-description").innerHTML = descriptionElement.value;
      changeDescriptionButton.removeAttribute("disabled");
    });
  }

  // block.appendChild(subjectElement);
  let deleteButton = subjectElement.querySelector(".admin-page__delete");
  if (deleteButton) {
    deleteButton.addEventListener("click", function () {
      //subjectElement.classList.toggle("active");
      let modal = confirm(
        "Видалити " + testResult.name + " по ІД: " + testResult._id
      );
      if (modal) {
        alert(`Видалено!
Насправді - ні, це всього лише заглушка`);
      }
    });
  }

  let updateStatusButton = subjectElement.querySelector(
    ".admin-page__change-visibility"
  );

  if (updateStatusButton) {
    updateStatusButton.addEventListener("click", async function () {


      let testData = await impHttp.getTestById([testResult.testId]);
      testData = testData.data;

      //subjectElement.classList.toggle("active");
      let popupObj = impPopups.yesNoPopup(`Змінити статус ${testData.name} по ІД: ${testData._id}?`);
      document.querySelector("body").appendChild(popupObj.popup);
      let yesButton = popupObj.yesButton;
      yesButton.addEventListener("click", async function (e) {
        e.preventDefault();
        popupObj.popup.remove();

        let tName = testData.name;
        let status;
        console.log("testData", testData);

        if (testData.status == false) {
          status = true;
          tName = tName.replace("⛔", "✅");

          console.log(`${scriptUrl}?fileId=${testData.testId}&action=unrestrict`);
          
          await fetch(`${scriptUrl}?fileId=${testData.testId}&action=unrestrict`)
            .then(response => response.text()) // або .json(), якщо очікуєш JSON-відповідь
            .then(data => console.log(data))
            .catch(error => console.error("Помилка:", error));
        } else {
          status = false;
          tName = tName.replace("✅", "⛔"); 

          console.log(`${scriptUrl}?fileId=${testData.testId}&action=restrict`);

          await fetch(`${scriptUrl}?fileId=${testData.testId}&action=restrict`)
            .then(response => response.text()) // або .json(), якщо очікуєш JSON-відповідь
            .then(data => console.log(data))
            .catch(error => console.error("Помилка:", error));;
         
          
        }

        //-https://script.google.com/macros/s/AKfycbwBOiI9Vic2eHDvPTTMqi0C6rI4TjcWZ0_a6LiRvx5X5iHaw6iyWC7i5BVowEsjkxn8/exec?fileId=660efbcfcb608400553a57db&action=unrestrict
        //+https://script.google.com/macros/s/AKfycbwBOiI9Vic2eHDvPTTMqi0C6rI4TjcWZ0_a6LiRvx5X5iHaw6iyWC7i5BVowEsjkxn8/exec?fileId=1zX0I8o4221VqwLFprmb6xPE1XaD9C9Rr6t-9RUqBzwQ&action=unrestrict

        await impHttp.changeDBParam(testData.testId, "status", status);
        await impHttp.changeDBParam(testData.testId, "name", tName);
        await impHttp.setDocumentParam(testData.testId, "name", tName);

        let parent = updateStatusButton.parentElement;
        await new Promise((r) => setTimeout(r, 500));
        let test = await impHttp.getTestById([testData.testId]);
        parent.parentElement.getElementsByClassName("aTagToDocument")[0].innerHTML = test.data.name;
      });
      let noButton = popupObj.noButton;
      noButton.addEventListener("click", async function (e) {
        e.preventDefault();
        popupObj.popup.remove();
      });
    });
  }

  return subjectElement;
}

//https://chatgpt.com/share/67ee39ac-30e0-8007-8e00-251c0bb56ca9
//https://chatgpt.com/share/67ef8ab9-6aa8-8007-bb5d-a92d334f2d40
const scriptUrl = "https://script.google.com/macros/s/AKfycbwBOiI9Vic2eHDvPTTMqi0C6rI4TjcWZ0_a6LiRvx5X5iHaw6iyWC7i5BVowEsjkxn8/exec";

// 1. Функція для обмеження всіх файлів у папці
async function callRestrictAllFiles() {
  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors"
    })
      .then(response => response.text()) // або .json(), якщо очікуєш JSON-відповідь
      .then(data => console.log(data))
      .catch(error => console.error("Помилка:", error));;
    //console.log("All files restricted successfully");
  } catch (error) {
    console.error("Error restricting all files:", error);
  }
}

// Використання:
document.querySelector(".closePermissions")?.addEventListener("click", callRestrictAllFiles);


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


// const closePermissions = document.querySelector(".closePermissions");
// const scriptUrl = "https://script.google.com/macros/s/AKfycbzrtZk49IKakVNUeVmu5d0FWWDSHq5wgfOYqb6fOxDS_9mXHgdhBAtR62x_2rCGObOf/exec";

// if (closePermissions) {
//   closePermissions.addEventListener("click", function () {
//     console.log("closePermissions");
//     callRestrictFunction();

//   });
// }

// async function callRestrictFunction() {
//   try {
//       let response = await fetch(scriptUrl, {
//           method: "POST", // Або "GET", якщо так налаштовано у GAS
//           mode: "no-cors" // Якщо не потрібно отримувати відповідь
//       });
//       console.log("Function executed successfully");
//   } catch (error) {
//       console.error("Error calling the script:", error);
//   }
// }



