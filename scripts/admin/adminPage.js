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
    //console.log(window.userInfo);

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
  let resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  const uniqueUsers = Array.from(
    new Map(usersInfo.map((user) => [user.username, user])).values()
  );
  uniqueUsers.sort((a, b) => {
    return new Date(b.passDate) - new Date(a.passDate);
  });
  uniqueUsers.forEach((user) => {
    let userInfo = [user];
    let generalUserElement = document.createElement("div");
    generalUserElement.classList.add("general-user-block");
    resultsBlock.appendChild(generalUserElement);
    let userBlock = impCreateAnswers.createUserBlockAdm(
      generalUserElement,
      testsInfo,
      userInfo,
      null,
      null,
      null,
      null,
      null
    );
  });
}

function getFilrationParams() {
  let subject = document.querySelector(".selectSubject")?.getAttribute("value");
  if (!subject || subject == "null") {
    subject = null;
  }
  if (typeof subject == "string") {
    subject = JSON.parse(subject);
  }

  let student = document.querySelector(".selectStudent")?.getAttribute("value");
  if (!student || student == "null") {
    student = null;
  }

  let group = document.querySelector(".selectGroup")?.getAttribute("value");
  if (!group || group == "null") {
    group = null;
  }

  let date = document.querySelector(".selectDate")?.getAttribute("value");
  if (!date || date == "null") {
    date = null;
  }
  if (typeof date == "string") {
    date = JSON.parse(date);
  }

  let mark = document.querySelector(".selectMark")?.getAttribute("value");
  if (!mark || mark == "null") {
    mark = null;
  }

  return { student, group, subject: subject, date: date, mark };
}

async function createSelectButton(usersInfo, usersAnswersInfo) {
  // сортування по даті по дефолту
  usersAnswersInfo.sort((a, b) => {
    return new Date(b.passDate) - new Date(a.passDate);
  });
  //Вибір Предмету
  let selectSubject = document.querySelector(".selectSubject");
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
    let subjectValue = selectedOption.value;
    if (subjectValue == "null" || !subjectValue) {
      subjectValue = null;
    }
    selectSubject.setAttribute("value", subjectValue);
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    let { student, group, subject, date } = getFilrationParams();
    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      student,
      group,
      subject,
      date,
      null
    );
  });

  //Вибір групи
  let groupSelect = document.querySelector(".selectGroup");
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
    let groupValue = selectedOption.value;
    if (groupValue == "null" || !groupValue) {
      groupValue = null;
    }
    groupSelect.setAttribute("value", groupValue);

    // виводимо інформацію

    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    let { student, group, subject, date } = getFilrationParams();

    resultsBlock.innerHTML = "";

    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      student,
      group,
      subject,
      date
    );
  });

  //Вибір по даті
  let selectDate = document.querySelector(".selectDate");
  if (!selectDate) {
    return;
  }

  selectDate.addEventListener("change", function (e) {
    let dateValue = new Date(selectDate.value).setHours(0, 0, 0, 0);

    if (dateValue == "null" || !dateValue) {
      dateValue = null;
    }
    selectDate.setAttribute("value", dateValue);
    // виводимо інформацію
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    let { student, group, subject, date } = getFilrationParams();

    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      student,
      group,
      subject,
      date
    );
  });

  //Вибір студента
  let studentSelect = document.querySelector(".selectStudent");
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
    let studentValue = selectedOption.value;
    if (studentValue == "null") {
      studentValue = null;
    }
    studentSelect.setAttribute("value", studentValue);

    // виводимо інформацію
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }

    resultsBlock.innerHTML = "";

    let { student, group, subject, date } = getFilrationParams();

    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      student,
      group,
      subject,
      date
    );
  });

  //Вибір оцінки
  let markSelect = document.querySelector(".selectMark");
  if (!markSelect) {
    return;
  }
  markSelect.addEventListener("change", function (e) {
    let selectedOption = markSelect.options[markSelect.selectedIndex];
    let markValue = selectedOption.value;
    if (markValue == "null") {
      markValue = null;
    }
    markSelect.setAttribute("value", markValue);
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Бло�� результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    let { student, group, subject, date, mark } = getFilrationParams();
    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      student,
      group,
      subject,
      date,
      mark,
      null
    );
  });

  if (allTestsResponse.status != 200) {
    return alert("Неможливо отримати тест");
  }
  testsInfo = allTestsResponse.data;

  if (profileInfo.roles.includes("ADMIN")) {
    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      userTestsInfo
    );
  } else {
    impCreateAnswers.createUserBlock(resultsBlock, testsInfo, userTestsInfo, null, null, null, null, null);
  }
}
