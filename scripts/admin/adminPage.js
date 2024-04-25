import * as importConfig from "../dev/config.js";
import * as impHttp from "../http/api-router.js";
import * as impPopups from "../components/popups.js";
import * as impSubject200 from "../convert200.js";
import * as impCreateAnswers from "../components/createAnswersBlock.js";

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
    let userBlock = impCreateAnswers.createUserBlockAdm(
      generalUserElement,
      testsInfo,
      userInfo
    );
    if (userBlock) {
      generalUserElement.appendChild(
        impCreateAnswers.createUserBlockAdm(
          generalUserElement,
          testsInfo,
          userInfo
        )
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
    let subject = impCreateAnswers.setSubjectNameBySubject(subjectCode);

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

    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersInfo,
      student,
      null,
      JSON.parse(subject)
    );
  });

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
    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersInfo,
      student,
      null,
      subject
    );
  });
}
