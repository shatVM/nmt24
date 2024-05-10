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
  let resultsBlock = document.querySelector(".admin-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  const uniqueUsers = Array.from(
    new Map(usersInfo.map((user) => [user.username, user])).values()
  );


  // Сортування масиву унікальних користувачів по полю passDate по спаданню
  // Нові користувачі на початку списку
  uniqueUsers.sort((a, b) => {
    return new Date(b.passDate) - new Date(a.passDate);
  });

  uniqueUsers.forEach((user) => {
    //console.log('user ',user)
    let userInfo = [user];
    //console.log('userInfo ', userInfo)

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

function getFilrationParams() {
  let subject = document
    .querySelector(".admin-page__selectSubject")
    ?.getAttribute("value");
  if (!subject || subject == "null") {
    subject = null;
  }
  if (typeof subject == "string") {
    subject = JSON.parse(subject);
  }

  let student = document
    .querySelector(".admin-page__selectStudent")
    ?.getAttribute("value");
  if (!student || student == "null") {
    student = null;
  }

  let group = document
    .querySelector(".admin-page__selectGroup")
    ?.getAttribute("value");
  if (!group || group == "null") {
    group = null;
  }

  let date = document
    .querySelector(".admin-page__selectDate")
    ?.getAttribute("value");
  if (!date || date == "null") {
    date = null;
  }
  if (typeof date == "string") {
    date = JSON.parse(date);
  }

  let mark = document
    .querySelector(".admin-page__selectMark")
    ?.getAttribute("value");
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
    let subjectValue = selectedOption.value;
    if (subjectValue == "null" || !subjectValue) {
      subjectValue = null;
    }
    selectSubject.setAttribute("value", subjectValue);

    // виводимо інформацію
    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";

    // отримуємо дані з селектів
    let { student, group, subject, date } = getFilrationParams();
    console.log(student, group, subject, date);

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
    let groupValue = selectedOption.value;
    if (groupValue == "null" || !groupValue) {
      groupValue = null;
    }
    groupSelect.setAttribute("value", groupValue);

    // виводимо інформацію

    let resultsBlock = document.querySelector(".admin-results");
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
  let selectDate = document.querySelector(".admin-page__selectDate");
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
    let resultsBlock = document.querySelector(".admin-results");
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
    let studentValue = selectedOption.value;
    if (studentValue == "null") {
      studentValue = null;
    }
    studentSelect.setAttribute("value", studentValue);

    // виводимо інформацію
    let resultsBlock = document.querySelector(".admin-results");
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
  let markSelect = document.querySelector(".admin-page__selectMark");
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

    // виводимо інформацію
    let resultsBlock = document.querySelector(".admin-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
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
      mark
    );
  });
}
