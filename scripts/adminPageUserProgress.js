import * as impPopups from "./components/popups.js";
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

const fillTestBlocks = (userBlock, tests, correctTests = []) => {
  const testBlocks = userBlock.querySelectorAll(
    ".admin-page__user-current-test-progress"
  );
  testBlocks.forEach((testBlock) => {
    const testId = testBlock.getAttribute("test");
    const testData = tests.find((test) => test.testId == testId);
    //console.log(testData);
    testData.answers.forEach((answer, index) => {
      let correctAnswerArr = correctTests[index];

      let isAnswerCorrect = answer.answer.every((item, index) => {
        return item == correctAnswerArr[index];
      });

      testBlock.innerHTML += `
        <div class="admin-page__user-current-test-progress-item ${answer.submitted ? "passed" : ""
        } ${!isAnswerCorrect && answer.submitted ? "answer_wrong-with-bg" : ""
        }">${answer.question + 1}</div>
      `;
    });
  });
};

const appendUser = async (name, tests, testsArray, user) => {
  const users = document.querySelector(".admin-page__users");
  let userBlock = document.createElement("div");
  userBlock.classList.add("admin-page__users-user");
  userBlock.innerHTML =
    `
  <div class="admin-page__users-info">
    <div class="result-item__name_block">
      <input type='checkbox' class='delete-check-box test-check-box' >
      <h2 class="result-item__name">${name}</h2>
    </div>
    <button class="test-footer__button admin-page__delete result-item__name_btn_remove ">Видалити</button>
  </div>
  `;
  for (const test of tests) {
    let testBlock = document.createElement("div");
    testBlock.classList.add("admin-page__users-test");
    testBlock.innerHTML = `
      <h3>${test.name}<span class="admin-page__user-current-test-progress-precentage"></span></h3>    
      <div class="admin-page__user-current-test-progress" test="${test.testId}"></div>        
    `;
    let correctTests = await getCorrectAnswer(test, testsArray);
    fillTestBlocks(testBlock, tests, correctTests);
    userBlock.appendChild(testBlock);
  }

  //Блок видалення користувача  
  let removeButton = userBlock.querySelector(".result-item__name_btn_remove");
  removeButton.addEventListener("click", async () => {

    let main = document.querySelector("main");
    let popupText = `
        Видалити користувача <h2> ${name}?</h2>
        `;

    let popupObj = impPopups.yesNoPopup(popupText);
    main.appendChild(popupObj.popup);
    let yesButton = popupObj.yesButton;
    yesButton.addEventListener("click", async function (e) {
      e.preventDefault();
      popupObj.popup.remove();
      let response = await impHttp.removeCurrentPassingUserByEmail(user.email);
      if (response.status == 200) {
        userBlock.remove();
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
  users.appendChild(userBlock);
};

const removeOldUsers = () => {
  const users = document.querySelector(".admin-page__users");
  users.innerHTML = "";
};

const initRefreshButton = () => {
  const refreshButton = document.querySelector(".admin-page__refresh-button");
  refreshButton.addEventListener("click", () => adminPage());
};

const appendData = async () => {
  const { data: currentPassingUsers } =
    await impHttp.getAllCurrentPassingUsers();

  // шось працює а як це не важливо
  let testIsd = Array.from(
    new Set(
      currentPassingUsers
        .map((item) => {
          return item.tests.map((item) => {
            return item.testId;
          });
        })
        .flat()
    )
  );

  let correctTests = await getTestsInformation(testIsd);

  removeOldUsers();

  currentPassingUsers.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  currentPassingUsers.map(async (user) => {
    await appendUser(user.name, user.tests, correctTests, user);
  });

  if (currentPassingUsers.length == 0) {
    const users = document.querySelector(".admin-page__users");
    users.innerHTML = "<h4>Зараз немає користувачів які проходять тести</h4>";
  }
};

const adminPage = async () => {
  await appendData();
};

const initRefreshing = () => {
  setInterval(() => {
    adminPage();
    //console.log("Refresh");
  }, 10000);
};

initRefreshButton();
initRefreshing();

async function getTestsInformation(arr) {
  let testsInfoResponse = await impHttp.getAllTestsFromDB(arr);
  if (testsInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + testsInfoResponse.data.message);
  }
  return testsInfoResponse.data;
}

async function getCorrectAnswer(test, testsInfo) {
  let currentTest = testsInfo?.filter((obj) => obj.testId === test.testId);
  let currentTestBody = JSON.parse(currentTest[0].questions);

  if (!currentTestBody) {
    alert("error line 130");
  }

  let corectAnswers = currentTestBody.map((item) => {
    return item.correctAnswers;
  });

  return corectAnswers;
}


//обрати всі чекбокси .delete-check-box для видалення користувачів 
const selectAllButton = document.querySelector('.selectAll');
if (selectAllButton) {
  selectAllButton.addEventListener('click', function () {
    const checkboxes = document.querySelectorAll('.delete-check-box');
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = true;
    });
  });
}

// delete button
const deleteSelectedUsersButton = document.querySelector('.delete-current-passing-users');

// Add event listener to the delete button
deleteSelectedUsersButton.addEventListener('click', function () {

const selectedUsers = []
  // Отримання імен всіх обраних користувачів
  const selectedItems = document.querySelectorAll('.delete-check-box:checked');
  selectedItems.forEach(function (checkbox) {
    const resultItem = checkbox.closest('.admin-page__users-user');
    if (resultItem) {
      selectedUsers.push(resultItem.querySelector('h2').innerText)
    }
  });  

  //Вивести дані масиву selectedUsers кожен за новим рядком
  let userList = selectedUsers.map(user => `<div style = "float:left">${user}</div>`).join('');

  let popupText = `
      <h2>Видалити обраних користувачів?</h2>
      <h3 style = "height:300px; overflow:auto">${userList}</h3>
      `;

  let popupObj = impPopups.yesNoPopup(popupText);

  let main = document.querySelector("main");
  main.appendChild(popupObj.popup);
  let yesButton = popupObj.yesButton;
  yesButton.addEventListener("click", async function (e) {
    e.preventDefault();
    popupObj.popup.remove();

    selectedItems.forEach(function (checkbox) {
      const resultItem = checkbox.closest('.admin-page__users-user');
      if (resultItem) {
        // Trigger the delete action for the selected result item
        resultItem.querySelector('.result-item__name_btn_remove').click();

        // Wait for the "Yes" button to appear, and then click it
        setTimeout(function () {
          const yesButton = document.querySelector('button.buttons__button-yes');
          if (yesButton) {
            yesButton.click();
          }
        }, 1000); // Adjust the timeout if necessary to match the UI behavior
      }
    });

  });
  let noButton = popupObj.noButton;
  noButton.addEventListener("click", async function (e) {
    e.preventDefault();
    popupObj.popup.remove();
  });


});