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
    testData.answers.forEach((answer, index) => {
      let correctAnswerArr = correctTests[index];

      let isAnswerCorrect = answer.answer.every((item, index) => {
        return item == correctAnswerArr[index];
      });

      testBlock.innerHTML += `
        <div class="admin-page__user-current-test-progress-item ${
          answer.submitted ? "passed" : ""
        } ${
        !isAnswerCorrect && answer.submitted ? "answer_wrong-with-bg" : ""
      }">${answer.question + 1}</div>
      `;
    });
  });
};

const appendUser = async (name, tests, testsArray) => {
  const users = document.querySelector(".admin-page__users");
  let userBlock = document.createElement("div");
  userBlock.classList.add("admin-page__users-user");
  userBlock.innerHTML = `<h2>${name}</h2>`;
  for (const test of tests) {
    let testBlock = document.createElement("div");
    testBlock.classList.add("admin-page__users-test");
    testBlock.innerHTML = `
      <h3>${test.name}</h3>    
      <div class="admin-page__user-current-test-progress" test="${test.testId}"></div>        
    `;
    let correctTests = await getCorrectAnswer(test, testsArray);
    fillTestBlocks(testBlock, tests, correctTests);
    userBlock.appendChild(testBlock);
  }
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

  currentPassingUsers.map(async (user) => {
    await appendUser(user.name, user.tests, correctTests);
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
    console.log("fdhfsfkldhkdsfshkds");
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
