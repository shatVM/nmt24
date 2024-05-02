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

const appendUser = (name, currentTest, questions) => {
  /* 
    usage example:
    appendUser("Іванов Іван Іванович", "Англійська мова 1", [
      {status: "passed"},
      {status: "passed"},
      {status: "active"},
      {status: ""},
      {status: ""},
    ]);
  */

  const users = document.querySelector(".admin-page__users");
  const userBlock = document.createElement("div");
  userBlock.classList.add("admin-page__users-user");
  userBlock.innerHTML = `
    <h2>${name}</h2>
    <h3>Зараз проходить: ${currentTest}</h3>
    <div class="admin-page__user-current-test-progress">
    </div>
  `;
  questions.forEach((question) => {
    userBlock.querySelector(".admin-page__user-current-test-progress").innerHTML += `
      <div class="admin-page__user-current-test-progress-item ${question.status}">
        ${questions.indexOf(question) + 1}
      </div>
    `;
  })
  users.appendChild(userBlock);
}

const adminPage = () => {
    const users = document.querySelector(".admin-page__users");
    appendUser("Іванов Іван Іванович", "Англійська мова 1", [
      {status: "passed"},
      {status: "passed"},
      {status: "passed"},
      {status: "passed"},
      {status: "passed"},
      {status: "active"},
      {status: ""},
      {status: ""},
      {status: ""},
      {status: ""},
    ]);
}