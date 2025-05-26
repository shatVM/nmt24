import * as impPopups from "./components/popups.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";

adminLogin();

async function adminLogin() {
  const loginForm = document.querySelector(".admin-page__login");
  if (!loginForm) return;

  const authResponse = await impHttp.isAuth();
  if (authResponse.status === 200) {
    if (hasAdminAccess()) {
      loginForm.remove();
      adminPage();
    } else {
      redirectToHome("В вас немає прав адміністратора");
    }
  } else {
    setupLoginForm(loginForm);
  }
}

function hasAdminAccess() {
  return ["ADMIN", "TEACHER"].some(role => window?.userInfo?.roles?.includes(role));
}

function redirectToHome(message) {
  location.href = importConfig.client_url;
  alert(message);
}

function setupLoginForm(loginForm) {
  const button = loginForm.querySelector(".admin-page__login-submit");
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.querySelector(".admin-page-email").value;
    const password = document.querySelector(".admin-page-password").value;
    const loginResponse = await impHttp.login(email, password);
    if (loginResponse.status === 200) {
      loginForm.remove();
      adminPage();
    }
  });
}

async function adminPage() {
  await appendData();
  initTimer();  
}

async function appendData() {
  const { data: currentPassingUsers } = await impHttp.getAllCurrentPassingUsers();
  const testIds = extractUniqueTestIds(currentPassingUsers);
  const correctTests = await getTestsInformation(testIds);
  console.log("currentPassingUsers = ", currentPassingUsers);
  removeOldUsers();
  renderUsers(currentPassingUsers, correctTests);
  setTimeout(updateH2Count, 1000);
}

function extractUniqueTestIds(users) {
  return Array.from(new Set(users.flatMap(user => user.tests.map(test => test.testId))));
}

function removeOldUsers() {
  document.querySelector(".admin-page__users").innerHTML = "";
}

async function renderUsers(users, correctTests) {
  users.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
  for (const user of users) {
    await appendUser(user.name, user.tests, correctTests, user);
  }

  if (users.length === 0) {
    document.querySelector(".admin-page__users").innerHTML = "<h4>Зараз немає користувачів які проходять тести</h4>";
  }
}

async function appendUser(name, tests, testsArray, user) {
  const usersContainer = document.querySelector(".admin-page__users");
  const userBlock = createUserBlock(user);

  for (const test of tests) {
    const testBlock = await createTestBlock(test, testsArray);
    userBlock.appendChild(testBlock);
  }

  setupUserActions(userBlock, name, user);
  usersContainer.appendChild(userBlock);
}

function createUserBlock(user) {
  const userBlock = document.createElement("div");
  userBlock.classList.add("admin-page__users-user");
  userBlock.innerHTML = `
    <div class="admin-page__users-info">
      <div class="result-item__name_block">
        <input type='checkbox' class='delete-check-box test-check-box'>
        <h2 class="result-item__name admin-page__name_collapse">${user.name} </h2>        
      </div>
      <div class="admin-page__user-test-time">🚀
      ${user.testStartTime ? new Date(user.testStartTime).toLocaleString() : ""} 🕗 ${
          user.testStartTime
            ? (() => {
                const ms = Date.now() - user.testStartTime;
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes.toString().padStart(2, "0")}:${seconds
                  .toString()
                  .padStart(2, "0")}`;
              })()
            : ""
        }       
      </div>      
      <div>
        <button class="test-footer__button result-item__info_block"></button>
        <button class="test-footer__button admin-page__delete result-item__name_btn_remove">Видалити</button>
      </div>
    </div>
  `;
  return userBlock;
}

async function createTestBlock(test, testsArray) {
  const testBlock = document.createElement("div");
  testBlock.classList.add("admin-page__users-test");
  testBlock.innerHTML = `
    <h3>${test.name}<span class="admin-page__user-current-test-progress-precentage"></span></h3>
    <div class="admin-page__user-current-test-progress" test="${test.testId}"></div>
  `;

  const correctTests = await getCorrectAnswer(test, testsArray);
  fillTestBlocks(testBlock, [test], correctTests);
  return testBlock;
}

function setupUserActions(userBlock, name, user) {
  setupCollapseButton(userBlock);
  setupRemoveButton(userBlock, name, user);
}

function setupCollapseButton(userBlock) {
  const collapseButton = userBlock.querySelector(".admin-page__name_collapse");
  collapseButton.addEventListener("click", () => toggleUserDetails(userBlock));
}

function toggleUserDetails(userBlock) {
  const testBlocks = userBlock.querySelectorAll(".admin-page__users-test");
  const infoBlock = userBlock.querySelector(".result-item__info_block");
  if (!infoBlock) return;

  infoBlock.innerHTML = "";
  const spanResults = userBlock.querySelectorAll(".result-span");
  spanResults.forEach(span => infoBlock.prepend(span.cloneNode(true)));
}

function setupRemoveButton(userBlock, name, user) {
  const removeButton = userBlock.querySelector(".result-item__name_btn_remove");
  removeButton.addEventListener("click", () => confirmUserRemoval(userBlock, name, user));
}

function confirmUserRemoval(userBlock, name, user) {
  const popupText = `Видалити користувача <h2>${name}?</h2>`;
  const popupObj = impPopups.yesNoPopup(popupText);
  document.querySelector("main").appendChild(popupObj.popup);

  popupObj.yesButton.addEventListener("click", async (e) => {
    e.preventDefault();
    popupObj.popup.remove();
    const response = await impHttp.removeCurrentPassingUserByEmail(user.email);
    if (response.status === 200) {
      userBlock.remove();
    } else {
      alert("Помилка видалення відповіді!");
    }
  });

  popupObj.noButton.addEventListener("click", (e) => {
    e.preventDefault();
    popupObj.popup.remove();
  });
}

function fillTestBlocks(userBlock, tests, correctTests = []) {
  const testBlocks = userBlock.querySelectorAll(".admin-page__user-current-test-progress");
  testBlocks.forEach((testBlock) => {
    const testId = testBlock.getAttribute("test");
    const testData = tests.find(test => test.testId == testId);

    testData.answers.forEach((answer, index) => {
      const correctAnswerArr = correctTests[index];
      const isAnswerCorrect = answer.answer.every((item, idx) => item === correctAnswerArr[idx]);

      testBlock.innerHTML += `
        <div class="admin-page__user-current-test-progress-item ${answer.submitted ? "passed" : ""} ${!isAnswerCorrect && answer.submitted ? "answer_wrong-with-bg" : ""}">
          ${answer.question + 1}
        </div>
      `;
    });
  });
  
}

async function getTestsInformation(testIds) {
  const response = await impHttp.getAllTestsFromDB(testIds);
  if (response.status !== 200) {
    alert("Помилка отримання даних: " + response.data.message);
    return [];
  }
  return response.data;
}

async function getCorrectAnswer(test, testsInfo) {
  const currentTest = testsInfo.find(obj => obj.testId === test.testId);
  const currentTestBody = JSON.parse(currentTest?.questions || "[]");

  return currentTestBody.map(item => item.correctAnswers);
}

function initTimer() {
  const timerButton = document.querySelector(".admin-page__timer-button");
  if (!timerButton) return;

  let timer = 30;
  timerButton.textContent = timer;

  setInterval(() => {
    timerButton.textContent = timer;
    timer--;
    if (timer === 0) timer = 30;
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  updateH2Count();
});

function updateH2Count() {
  const h2Count = document.querySelectorAll("h2").length;
  //console.log("h2Count = " + h2Count);
  document.querySelector(".admin-page__count-button").textContent = h2Count;
}

initRefreshButton();
initRefreshing();

function initRefreshButton() {
  const refreshButton = document.querySelector(".admin-page__refresh-button");
  refreshButton.addEventListener("click", () => adminPage());
}

function initRefreshing() {
  setInterval(() => {
    adminPage();
    setTimeout(collapseUsers, 2000);
  }, 30000);
}

function collapseUsers() {
  document.querySelectorAll(".admin-page__name_collapse").forEach(button => button.click());
}


