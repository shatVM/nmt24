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

   
       if (["ADMIN", "TEACHER"].some(role => window?.userInfo?.roles?.includes(role))) {
         loginForm.remove();
         adminPage();
       } else{
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
  const usersAnswersResponse = await impHttp.getAllUserAnswers();
  if (usersAnswersResponse.status !== 200) {
    return Promise.reject(
      new Error(`Помилка отримання даних: ${usersAnswersResponse.data.message}`)
    );
  }

  //console.log(usersAnswersResponse.data)
  return usersAnswersResponse.data;
}



async function getTestsInformation() {
  try {
    const { status, data } = await impHttp.getAllTestsFromDB();
    if (status !== 200) throw new Error(data.message);
    return data;
  } catch (error) {
    alert("Помилка отримання даних: " + error.message);
  }
}

async function getUsersInformation() {
  try {
    const { status, data } = await impHttp.getAllUsers();
    if (status !== 200) throw new Error(data.message);
    return data;
  } catch (error) {
    alert("Помилка отримання даних: " + error.message);
  }
}

let testsInfo = await getTestsInformation();

async function adminPage() {
  const [usersAnswersInfo, usersInfo] = await Promise.all([
    getUsersAnswersInformation(),
    getUsersInformation(),
  ]);

  showAllUsers(usersAnswersInfo);
  //console.log("usersAnswersInfo ", usersAnswersInfo);
  //console.log("usersInfo ", usersInfo);
  await createSelectButton(usersInfo, usersAnswersInfo);
}

function showAllUsers(usersInfo) {
  const resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  const uniqueUsers = Array.from(
    new Map(usersInfo.map((user) => [user.username, user])).values()
  );
  const sortedUniqueUsers = uniqueUsers.sort((a, b) =>
    new Date(b.passDate).getTime() - new Date(a.passDate).getTime()
  );
  resultsBlock.innerHTML = "";
  sortedUniqueUsers.forEach((user) => {
    const generalUserElement = document.createElement("div");
    generalUserElement.classList.add("general-user-block");
    resultsBlock.appendChild(generalUserElement);
    impCreateAnswers.createUserBlockAdm(
      generalUserElement,
      testsInfo,
      usersInfo.filter((u) => u.username === user.username),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );
  });


}

export function getFilrationParams() {

  let student = document.querySelector(".selectStudent")?.getAttribute("value");
  if (!student || student == "null") {
    student = null;
  }

  let group = document.querySelector(".selectGroup")?.getAttribute("value");
  if (!group || group == "null") {
    group = null;
  }

  let subgroup = document.querySelector(".selectSubgroup")?.getAttribute("value");
  if (!subgroup || subgroup == "null") {
    subgroup = null;
  }

  let subject = document.querySelector(".selectSubject")?.getAttribute("value");
  //console.log('subject ', subject);
  if (!subject || subject == "null") {
    subject = null;
  }
  if (typeof subject == "string") {
    subject = JSON.parse(subject);
  }

  let variant = document.querySelector(".selectVariant")?.getAttribute("value");
  if (!variant || variant == "null" || variant == "Всі варіанти") {
    variant = null;
  }
  if (typeof variant == "string") {
    variant = JSON.parse(variant);
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
  if (typeof mark == "string") {
    mark = JSON.parse(mark);
  }

  return { student, group, subgroup, subject, variant, date, mark };
}

// Функція для збереження параметрів фільтрації
function saveFilterParams() {
  const params = getFilrationParams();
  //console.log('params ', params);
  localStorage.setItem('filterParams', JSON.stringify(params));
}

// Функція для відновлення параметрів фільтрації
function restoreFilterParams() {
  const savedParams = JSON.parse(localStorage.getItem('filterParams') || '{}');
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    if (savedParams[select.className]) {
      select.value = savedParams[select.className];
      select.setAttribute('value', savedParams[select.className]);
    }
  });

  const subjectInput = document.querySelector('.selectSubject');
  if (savedParams.subject) {
    subjectInput.value = JSON.stringify(savedParams.subject);
    subjectInput.setAttribute('value', JSON.stringify(savedParams.subject));
  }

  const variantInput = document.querySelector('.selectVariant');
  if (savedParams.variant) {
    variantInput.value = savedParams.variant;
    variantInput.setAttribute('value', savedParams.variant);
  }

  const dateInput = document.querySelector('.selectDate');
  if (savedParams.date) {
    dateInput.value = new Date(savedParams.date).toISOString().split('T')[0];
    dateInput.setAttribute('value', savedParams.date);
  }

  const groupInput = document.querySelector('.selectGroup');
  if (savedParams.group) {
    groupInput.value = savedParams.group;
    groupInput.setAttribute('value', savedParams.group);
  }

  const subgroupInput = document.querySelector('.selectSubgroup');
  if (savedParams.subgroup) {
    subgroupInput.value = savedParams.subgroup;
    subgroupInput.setAttribute('value', savedParams.subgroup);
  }

  const studentInput = document.querySelector('.selectStudent');
  if (savedParams.student) {
    studentInput.value = savedParams.student;
    studentInput.setAttribute('value', savedParams.student);
  }

  const markInput = document.querySelector('.selectMark');
  if (savedParams.mark) {
    markInput.value = savedParams.mark;
    markInput.setAttribute('value', savedParams.mark);
  }


}

// Функція для збереження параметрів сортування
function saveSortParams(key, direction) {
  const params = { key, direction };
  localStorage.setItem('sortParams', JSON.stringify(params));
}

// Функція для відновлення параметрів сортування
function restoreSortParams() {
  const savedParams = JSON.parse(localStorage.getItem('sortParams') || '{}');
  if (savedParams.key) {
    applySorting(savedParams.key, savedParams.direction);
  }
}

function applySorting(key, direction) {
  let resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) return;

  let resultItems = Array.from(resultsBlock.querySelectorAll(".result-item"));

  resultItems.sort((a, b) => {
    let valueA, valueB;

    try {
      switch (key) {
        case 'name':
          valueA = a.querySelector(".result-item__name")?.textContent.trim().toLowerCase() || "";
          valueB = b.querySelector(".result-item__name")?.textContent.trim().toLowerCase() || "";
          return direction === 'asc' ? valueA.localeCompare(valueB, 'uk') : valueB.localeCompare(valueA, 'uk');

        case 'test':
          valueA = a.querySelector(".result-item__title")?.textContent.trim().toLowerCase() || "";
          valueB = b.querySelector(".result-item__title")?.textContent.trim().toLowerCase() || "";
          return direction === 'asc' ? valueA.localeCompare(valueB, 'uk') : valueB.localeCompare(valueA, 'uk');

        case 'nmt':
          valueA = a.querySelector(".result-item__score")?.textContent.match(/НМТ:\s*(\d+|\D+)/)?.[1] || "0";
          valueB = b.querySelector(".result-item__score")?.textContent.match(/НМТ:\s*(\d+|\D+)/)?.[1] || "0";
          
          if (isNaN(valueA)) return 1;
          if (isNaN(valueB)) return -1;

          return direction === 'asc'
            ? valueA.localeCompare(valueB, 'uk', { numeric: true })
            : valueB.localeCompare(valueA, 'uk', { numeric: true });

        case 'mark':
          valueA = parseFloat(a.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)?.[1] || "0");
          valueB = parseFloat(b.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)?.[1] || "0");
          return direction === 'asc' ? valueA - valueB : valueB - valueA;

        default:
          return 0;
      }
    } catch (error) {
      console.error("Error during sorting:", error);
      return 0;
    }
  });

  resultsBlock.innerHTML = '';
  resultItems.forEach(item => {
    resultsBlock.appendChild(item);
  });
}


let currentSort = { key: 'date', direction: 'desc' }; 

function setupSortButton(buttonClass, sortKey) {
  const sortButton = document.querySelector(buttonClass);
  if (sortButton) {
    sortButton.addEventListener("click", function () {
      if (currentSort.key === sortKey) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.key = sortKey;
        currentSort.direction = 'desc'; 
      }
      
      applySorting(currentSort.key, currentSort.direction);
      saveSortParams(currentSort.key, currentSort.direction);
    });
  }
}

setupSortButton(".sortByName", "name");
setupSortButton(".sortByTest", "test");
setupSortButton(".sortByNMT", "nmt");
setupSortButton(".sortByMark", "mark");




async function createSelectButton(usersInfo, usersAnswersInfo) {
  // сортування по даті по дефолту
  usersAnswersInfo.sort((a, b) => {
    return new Date(b.passDate) - new Date(a.passDate);
  });

  //Фільтрація Предмету
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

    // Оновлюємо варіанти тестів при зміні предмету

    updateResults(usersAnswersInfo);
    updateVariants();
    saveFilterParams();
  });

  //Фільтр по варіанту
  let variantSelect = document.querySelector(".selectVariant");
  if (!variantSelect) {
    return;
  }
  variantSelect.addEventListener("change", function (e) {
    let selectedOption = variantSelect.options[variantSelect.selectedIndex];
    let variantValue = selectedOption.value;
    if (variantValue == "null" || !variantValue || variantValue == "Всі варіанти") {
      variantValue = null;
    }
    variantSelect.setAttribute("value", variantValue);

    updateResults(usersAnswersInfo);
    saveFilterParams();
  })

  //Фільтр по групі
  let groupSelect = document.querySelector(".selectGroup");
  if (!groupSelect) {
    return;
  }

  let uniqueGroups = new Set(usersAnswersInfo.map((user) => user.group));
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

    // Оновлюємо список студентів відповідно до вибраної групи
    let studentSelect = document.querySelector(".selectStudent");
    if (studentSelect) {
      // Очищаємо поточний список
      studentSelect.innerHTML = '<option value="null">Всі учні</option>';

      // Фільтруємо студентів по вибраній групі та підгрупі
      let filteredUsers = usersInfo;

      if (groupValue) {
        filteredUsers = filteredUsers.filter(user => user.group === groupValue);
      }

      // Перевіряємо вибрану підгрупу
      let selectedSubgroup = document.querySelector(".selectSubgroup")?.getAttribute("value");
      if (selectedSubgroup && selectedSubgroup !== "null") {
        filteredUsers = filteredUsers.filter(user => user.subgroup === selectedSubgroup);
      }

      // Сортуємо по імені
      filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

      // Додаємо відфільтрованих студентів
      filteredUsers.forEach((user) => {
        let option = document.createElement("option");
        option.setAttribute("value", user._id);
        option.innerHTML = user.name;
        studentSelect.appendChild(option);
      });

      // Скидаємо вибраного студента
      studentSelect.value = "null";
      studentSelect.setAttribute("value", null);
    }

    // Оновлюємо список підгруп відповідно до вибраної групи
    let subgroupSelect = document.querySelector(".selectSubgroup");
    if (subgroupSelect) {
      // Очищаємо поточний список
      subgroupSelect.innerHTML = '<option value="null">Всі підгрупи</option>';

      if (groupValue) {
        // Знаходимо унікальні підгрупи для вибраної групи
        let groupUsers = usersInfo.filter(user => user.group === groupValue);
        let uniqueSubgroups = [...new Set(groupUsers.map(user => user.subgroup))].filter(Boolean);
        uniqueSubgroups.sort();

        // Додаємо підгрупи
        uniqueSubgroups.forEach((subgroup) => {
          let option = document.createElement("option");
          option.setAttribute("value", subgroup);
          option.innerHTML = `Підгрупа ${subgroup}`;
          subgroupSelect.appendChild(option);
        });
      }

      // Скидаємо вибрану підгрупу
      subgroupSelect.value = "null";
      subgroupSelect.setAttribute("value", null);
    }

    // Оновлюємо результати
    updateResults(usersAnswersInfo);
    saveFilterParams();
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

    updateResults(usersAnswersInfo);
    saveFilterParams();
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

    // Якщо вибрано студента, автоматично встановлюємо його групу і підгрупу
    if (studentValue) {
      const selectedStudent = usersInfo.find(user => user._id === studentValue);
      if (selectedStudent) {
        // Встановлюємо групу
        let groupSelect = document.querySelector(".selectGroup");
        if (groupSelect) {
          groupSelect.value = selectedStudent.group;
          groupSelect.setAttribute("value", selectedStudent.group);
        }

        // Встановлюємо підгрупу
        let subgroupSelect = document.querySelector(".selectSubgroup");
        if (subgroupSelect && selectedStudent.subgroup) {
          subgroupSelect.value = selectedStudent.subgroup;
          subgroupSelect.setAttribute("value", selectedStudent.subgroup);
        }
      }
    }

    updateResults(usersAnswersInfo);
    saveFilterParams();
  });

  //Вибір оцінки для фільтрації результатів за оцінкою .result-item__score b:last-child

  let markSelect = document.querySelector(".selectMark");
  if (markSelect) {
    // Додаємо опції для оцінок від 1 до 12
    for (let i = 1; i <= 12; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", i);
      option.innerHTML = i;
      markSelect.appendChild(option);
    }

    markSelect.addEventListener("change", function (e) {
      let selectedOption = markSelect.options[markSelect.selectedIndex];
      let markValue = selectedOption.value;
      if (markValue == "null") {
        markValue = null;
      }

      let resultsBlock = document.querySelector(".user-results");
      let resultItems = Array.from(resultsBlock.querySelectorAll(".result-item"));
      resultItems.forEach(item => {
        let userMarkValue = item.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0";
        console.log('userMarkValue ', userMarkValue);
      });


      markSelect.setAttribute("value", markValue);

      updateResults(usersAnswersInfo);
      saveFilterParams();
    });
  }

  // Додаємо вибір підгрупи
  let subgroupSelect = document.querySelector(".selectSubgroup");
  if (subgroupSelect) {
    const subgroups = ["1", "2"];
    subgroups.forEach((subgroup) => {
      let option = document.createElement("option");
      option.setAttribute("value", subgroup);
      option.innerHTML = `Підгрупа ${subgroup}`;
      subgroupSelect.appendChild(option);
    });

    subgroupSelect.addEventListener("change", function (e) {
      let selectedOption = subgroupSelect.options[subgroupSelect.selectedIndex];
      let subgroupValue = selectedOption.value;
      if (subgroupValue == "null") {
        subgroupValue = null;
      }
      subgroupSelect.setAttribute("value", subgroupValue);

      // Оновлюємо список студентів при зміні підгрупи
      let studentSelect = document.querySelector(".selectStudent");
      if (studentSelect) {
        // Очищаємо поточний список
        studentSelect.innerHTML = '<option value="null">Всі учні</option>';

        // Фільтруємо студентів
        let filteredUsers = usersInfo;

        // Перевіряємо вибрану групу
        let selectedGroup = document.querySelector(".selectGroup")?.getAttribute("value");
        if (selectedGroup && selectedGroup !== "null") {
          filteredUsers = filteredUsers.filter(user => user.group === selectedGroup);
        }

        // Фільтруємо по підгрупі
        if (subgroupValue) {
          filteredUsers = filteredUsers.filter(user => user.subgroup === subgroupValue);
        }

        // Сортуємо по імені
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

        // Додаємо відфільтрованих студентів
        filteredUsers.forEach((user) => {
          let option = document.createElement("option");
          option.setAttribute("value", user._id);
          option.innerHTML = user.name;
          studentSelect.appendChild(option);
        });

        // Скидаємо вибраного студента
        studentSelect.value = "null";
        studentSelect.setAttribute("value", null);
      }

      updateResults(usersAnswersInfo);
      saveFilterParams();
    });
  }

  // Додаємо кнопку скидання фільтрів
  let resetButton = document.querySelector(".reset-filters");
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      document.querySelector(".selectSubject").value = "null";
      document.querySelector(".selectStudent").value = "null";
      document.querySelector(".selectGroup").value = "null";
      document.querySelector(".selectSubgroup").value = "null";
      document.querySelector(".selectDate").value = "";
      document.querySelector(".selectMark").value = "null";
      document.querySelector(".selectVariant").value = "null";

      // Скидаємо атрибути
      const selectors = [
        ".selectSubject",
        ".selectStudent",
        ".selectGroup",
        ".selectSubgroup",
        ".selectDate",
        ".selectMark",
        ".selectVariant"
      ];

      selectors.forEach(selector => {
        document.querySelector(selector)?.setAttribute("value", null);
      });

      localStorage.removeItem('filterParams');
      updateResults(usersAnswersInfo);
      saveFilterParams();
    });
  }

  // Додаємо збереження параметрів при зміні селектів
  const selectors = [".selectSubject", ".selectStudent", ".selectGroup", ".selectSubgroup", ".selectDate", ".selectMark"];
  selectors.forEach(selector => {
    document.querySelector(selector)?.addEventListener("change", function () {
      saveFilterParams();
    });
  });

  // Відновлюємо збережені параметри при завантаженні
  restoreFilterParams();
  updateResults(usersAnswersInfo);
  restoreSortParams();
  // let allTestsResponse = await impHttp.getAllTestsFromDB(testsIds);
  // if (allTestsResponse.status != 200) {
  //   return alert("Неможливо отримати тест");
  // }
  // testsInfo = allTestsResponse.data;

  // if (profileInfo.roles.includes("ADMIN")) {
  //   impCreateAnswers.createUserBlockAdm(
  //     resultsBlock,
  //     testsInfo,
  //     userTestsInfo
  //   );
  // } else {
  //   impCreateAnswers.createUserBlock(resultsBlock, testsInfo, userTestsInfo, null, null, null, null, null);
  // }
}

// Функція оновлення результатів
function updateResults(usersAnswersInfo) {
  let resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  let { student, group, subgroup, subject, variant, date, mark } = getFilrationParams();

  impCreateAnswers.createUserBlockAdm(
    resultsBlock,
    testsInfo,
    usersAnswersInfo,
    student,
    group,
    subgroup,
    subject,
    variant,
    date,
    mark,
  );


}

// Функція оновлення варіантів тестів
// function updateVariants() {
//   let a = document.querySelectorAll(".aTagToDocument");
//   // Отримати унікальний innerText з усіх елементів
//   let unique = [...new Set(Array.from(a, item => item.innerText))];
//   //Додати опцію Всі варіанти зі значенням null
//   unique.unshift("Всі варіанти");
//   let selectVariant = document.querySelector(".selectVariant");
//   if (!selectVariant) return;
//   selectVariant.innerHTML = "";
//   unique.forEach((item) => {
//     let option = document.createElement("option");
//     option.setAttribute("value", item);
//     option.innerHTML = item;
//     selectVariant.appendChild(option);
//   });
// }
function updateVariants() {
  const aTags = document.querySelectorAll(".aTagToDocument");
  
  // Отримати унікальні значення без пробілів та порожніх значень
  const unique = Array.from(aTags)
    .map(a => a.textContent.trim()) // очищення
    .filter(text => text !== "") // видалити порожні
    .filter((value, index, self) => self.indexOf(value) === index) // унікальні

    // Якщо потрібно числове сортування
    .sort((a, b) => parseInt(a) - parseInt(b));

  // Додати "Всі варіанти" на початок
  unique.unshift("Всі варіанти");

  const selectVariant = document.querySelector(".selectVariant");
  if (!selectVariant) return;

  selectVariant.innerHTML = ""; // очистити варіанти
  unique.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectVariant.appendChild(option);
  });
}







//Скопіювати прізвище Ім'я та оцінки в json об'єкт при натисканні на кнопку .copyMark
let copyMarkButton = document.querySelector(".copyMark");
if (copyMarkButton) {
  copyMarkButton.addEventListener("click", function () {
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) return;

    let resultItems = Array.from(resultsBlock.querySelectorAll(".result-item"));
    let marksData = resultItems.map(item => {
      let name = item.querySelector(".result-item__name")?.textContent || "";
      let score = item.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0";

      return {
        name: name.trim(),
        score: parseInt(score)
      };
    });

    //console.log(marksData)

    const formattedData = marksData.reduce((acc, { name, score }) => {
      // Розділення повного імені на частини
      const parts = name.split(' ');
      const [lastName, firstName] = parts;
      const key = `${firstName} ${lastName}`; // Формуємо ключ у вигляді "Ім'я Прізвище"

      if (!acc[key]) {
        acc[key] = [];
      }

      // Додаємо оцінку як текстовий елемент
      acc[key].push(score.toString());

      return acc;
    }, { "Середня оцінка курсу": [] });

    console.log(JSON.stringify(formattedData, null, 2));

    navigator.clipboard.writeText(JSON.stringify(formattedData, null, 2));
    alert("Оцінки скопійовано в буфер обміну");
  });
}


//обрати всі чекбокси .delete-check-box для видалення результатів 
//при повторному кліку зняти вибір

const selectAllButton = document.querySelector('.selectAll');
if (selectAllButton) {
  selectAllButton.addEventListener('click', function () {
    const checkboxes = document.querySelectorAll('.delete-check-box');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = !allChecked;
    });
  });
}

// delete button
const deleteResultsButton = document.getElementsByClassName('deleteResult')[0];


// Add event listener to the delete button
deleteResultsButton.addEventListener('click', function () {

  const selectedUsers = []
  // Отримання імен всіх обраних користувачів
  const selectedItems = document.querySelectorAll('.delete-check-box:checked');
  selectedItems.forEach(function (checkbox) {
    const resultItem = checkbox.closest('.result-item__info');
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
      const resultItem = checkbox.closest('.user-results__item');
      if (resultItem) {
        // Trigger the delete action for the selected result item
        resultItem.querySelector('.admin-page__delete').click();

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



// Hide button
const hideResultsButton = document.querySelector('.hideResult');
if (hideResultsButton) {
  hideResultsButton.addEventListener('click', function () {
    const selectedItems = document.querySelectorAll('.delete-check-box:checked');
    selectedItems.forEach(function (checkbox) {
      const subjectElement = checkbox.closest('.user-results__item');
      if (subjectElement) {
        subjectElement.remove();
      }
    });
  });
}

// Auto-refresh functionality
const reloadButton = document.querySelector('.reloadResult');
let autoRefreshInterval;
let isAutoRefreshing = false;
const refreshIntervalSeconds = 30;

async function refreshResults() {
  const usersAnswersInfo = await getUsersAnswersInformation();
  updateResults(usersAnswersInfo);
  restoreSortParams(); // Re-apply sorting
  console.log('Results updated automatically.');
}

if (reloadButton) {
  reloadButton.addEventListener('click', () => {
    if (isAutoRefreshing) {
      // Stop auto-refresh
      clearInterval(autoRefreshInterval);
      isAutoRefreshing = false;
      reloadButton.classList.remove('active');
      reloadButton.textContent = 'Запустити автооновлення';
      console.log('Auto-refresh stopped.');
    } else {
      // Start auto-refresh
      isAutoRefreshing = true;
      reloadButton.classList.add('active');
      console.log('Auto-refresh started.');
      
      let remainingTime = refreshIntervalSeconds;

      const countdown = () => {
        remainingTime--;
        reloadButton.textContent = `Зупинити автооновлення ${remainingTime}`;
        
        if (remainingTime === 0) {
          refreshResults();
          remainingTime = refreshIntervalSeconds + 1; // because it's decremented at the start
        }
      };
      
      refreshResults(); // Initial refresh
      reloadButton.textContent = `Зупинити автооновлення ${remainingTime}`;
      autoRefreshInterval = setInterval(countdown, 1000);
    }
  });
}
