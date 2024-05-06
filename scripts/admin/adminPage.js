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
    console.log(window.userInfo);

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

async function getUsersAnswersInformation() {
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

async function getUsersInformation() {
  let testsInfoResponse = await impHttp.getAllUsers();
  if (testsInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + testsInfoResponse.data.message);
  }
  return testsInfoResponse.data;
}

let testsInfo = await getTestsInformation();

async function adminPage() {
  let usersAnswersInfo = await getUsersAnswersInformation();

  let usersInfo = await getUsersInformation();
  showAllUsers(usersAnswersInfo);
  await createSelectButton(usersInfo, usersAnswersInfo);
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

async function createSelectButton(usersInfo, usersAnswersInfo) {
  //Вибір Предмету
  let selectSubject = document.querySelector(".admin-page__selectSubject");
  if (!selectSubject) {
    return;
  }

  const uniqueSubject = new Set(usersAnswersInfo.map((item) => item.subject));
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

    // перевіряємо чекбокс студента
    let student = document
      .querySelector(".admin-page__selectStudent")
      ?.getAttribute("value");
    if (student && student == "null") {
      student = null;
    }

    // перевіряємо чекбокс групи
    let group = document
      .querySelector(".admin-page__selectGroup")
      ?.getAttribute("value");
    if (group && group == "null") {
      group = null;
    }

    // перевіряємо дату
    let date = document
      .querySelector(".admin-page__selectDate")
      ?.getAttribute("value");
    if (date && date == "null") {
      date = null;
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
      usersAnswersInfo,
      student,
      group,
      JSON.parse(subject),
      +date
    );
  });

  //Вибір групи
  let groupSelect = document.querySelector(".admin-page__selectGroup");
  if (!groupSelect) {
    return;
  }

  let uniqueGroups = new Set(usersInfo.map((user) => user.group));
  uniqueGroups = Array.from(uniqueGroups).sort();

  uniqueGroups.forEach((group) => {
    let option = document.createElement("option");
    option.setAttribute("value", group);
    option.innerHTML = group;
    groupSelect.appendChild(option);
  });

  groupSelect.addEventListener("change", function (e) {
    let selectedOption = groupSelect.options[groupSelect.selectedIndex];
    let group = selectedOption.value;
    if (group == "null") {
      group = null;
    }
    groupSelect.setAttribute("value", group);
    // перевіряємо інші чекбокси
    let subject = document
      .querySelector(".admin-page__selectSubject")
      ?.getAttribute("value");
    if (subject && subject == "null") {
      subject = null;
    }
    // перевіряєо студента
    let studentId = document
      .querySelector(".admin-page__selectStudent")
      ?.getAttribute("value");
    if (studentId && studentId == "null") {
      studentId = null;
    }

    // перевіряємо дату
    let date = document
      .querySelector(".admin-page__selectDate")
      ?.getAttribute("value");
    if (date && date == "null") {
      date = null;
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
      usersAnswersInfo,
      studentId,
      group,
      JSON.parse(subject),
      +date
    );
  });

  //Вибір по даті
  let selectDate = document.querySelector(".admin-page__selectDate");
  if (!selectDate) {
    return;
  }

  selectDate.addEventListener("change", function (e) {
    let date = new Date(selectDate.value).setHours(0, 0, 0, 0);

    if (date == "null") {
      date = null;
    }
    selectDate.setAttribute("value", date);
    // перевіряємо інші чекбокси

    // перевіряємо чекбокс предмета
    let subject = document
      .querySelector(".admin-page__selectSubject")
      ?.getAttribute("value");
    if (subject && subject == "null") {
      subject = null;
    }
    // перевіряємо чекбокс студента
    let student = document
      .querySelector(".admin-page__selectStudent")
      ?.getAttribute("value");
    if (student && student == "null") {
      student = null;
    }

    // перевіряємо чекбокс групи
    let group = document
      .querySelector(".admin-page__selectGroup")
      ?.getAttribute("value");
    if (group && group == "null") {
      group = null;
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
      usersAnswersInfo,
      student,
      group,
      JSON.parse(subject),
      date
    );
  });

  //Вибір студента
  let studentSelect = document.querySelector(".admin-page__selectStudent");
  if (!studentSelect) {
    return;
  }

  usersInfo.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  usersInfo.forEach((user) => {
    let option = document.createElement("option");
    option.setAttribute("value", user._id);
    option.innerHTML = user.name;
    studentSelect.appendChild(option);
  });

  studentSelect.addEventListener("change", function (e) {
    let selectedOption = studentSelect.options[studentSelect.selectedIndex];
    let studentId = selectedOption.value;
    if (studentId == "null") {
      studentId = null;
    }
    studentSelect.setAttribute("value", studentId);
    // перевіряємо інші чекбокси

    // перевіряємо чекбокс предмета
    let subject = document
      .querySelector(".admin-page__selectSubject")
      ?.getAttribute("value");
    if (subject && subject == "null") {
      subject = null;
    }

    // перевіряємо чекбокс групи
    let group = document
      .querySelector(".admin-page__selectGroup")
      ?.getAttribute("value");
    if (group && group == "null") {
      group = null;
    }

    // перевіряємо дату
    let date = document
      .querySelector(".admin-page__selectDate")
      ?.getAttribute("value");
    if (date && date == "null") {
      date = null;
    }

    // виводимо інформацію
    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    console.log(date);
    resultsBlock.innerHTML = "";
    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      studentId,
      group,
      JSON.parse(subject),
      +date
    );
  });
}
