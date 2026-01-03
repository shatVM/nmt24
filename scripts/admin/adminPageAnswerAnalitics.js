import * as impHttp from "../http/api-router.js";
import * as impPopups from "../components/popups.js";
// Ensure analytics is generated for each test separately

function formatUserLink(username, userId) {
    const shortName = username
        ? username.split(" ").slice(0, 2).join(" ")
        : "Unknown User";
    if (!userId) {
        return shortName;
    }
    return `<a class="admin-user-link" href="adminPageUsers.html?userId=${encodeURIComponent(userId)}">${shortName}</a>`;
}

document.querySelector('.analizeTests').addEventListener("click", () => {
    generateTestAnalytics();
});


// Викликаємо функцію для генерації аналітики після завершення завантаження сторінки
window.addEventListener("load", () => {
    // Викликаємо функцію для генерації аналітики
    generateTestAnalytics();
});

// Отримуємо всі відповіді користувачів
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

async function generateTestAnalytics() {
    const testAnalyticsContainer = document.querySelector(".test-analytics");
    if (!testAnalyticsContainer) {
        return alert("Помилка! Блок аналітики не знайдено");
    }

    // Отримуємо всі відповіді користувачів
    // const usersAnswersResponse = await impHttp.getAllUserAnswers();
    // if (usersAnswersResponse.status !== 200) {
    //     return Promise.reject(
    //         new Error(`Помилка отримання даних: ${usersAnswersResponse.data.message}`)
    //       );
    // }

    // console.log(usersAnswersResponse.data)
    //return usersAnswersResponse.data;

    const usersAnswers = await getUsersAnswersInformation();

    async function adminPage() {
        const [usersAnswers, usersInfo] = await Promise.all([
            getUsersAnswersInformation(),
            getUsersInformation(),
        ]);


        //console.log("usersAnswers ", usersAnswers);
        //console.log("usersInfo ", usersInfo);

    }

    //const usersAnswers = usersAnswersResponse.data;
    // console.log(usersAnswers);

    // структура usersAnswers
    //{
    //     "userid": "66264e6dcc121000567f2a1b",
    //     "group": "11-Г",
    //     "subgroup": "2",
    //     "school": "Науковий ліцей Житомирської політехніки",
    //     "answersArray": "[{\"question\":0,\"answer\":[\"Е\",\"Д\",\"Г\",\"Ж\",\"Б\"],\"type\":6,\"submitted\":true},{\"question\":1,\"answer\":[\"В\",\"Г\",\"В\",\"А\",\"Г\"],\"type\":5,\"submitted\":true},{\"question\":2,\"answer\":[\"Є\",\"Е\",\"В\",\"Ж\",\"Д\",\"Б\"],\"type\":7,\"submitted\":true},{\"question\":3,\"answer\":[\"А\",\"В\",\"Б\",\"Ж\",\"Г\",\"Є\"],\"type\":7,\"submitted\":true},{\"question\":4,\"answer\":[\"А\",\"Б\",\"Г\",\"А\",\"А\"],\"type\":5,\"submitted\":true},{\"question\":5,\"answer\":[null,null,null,null,null],\"type\":5,\"submitted\":false}]",
    //     "passDate": 1733831754669,
    //     "testScore": 17,
    //     "generalAnswers": 32,
    //     "_id": "67582c4a6d5e320012218d70",
    //     "testId": "1tqpJySRMUzZ9jFyUQ09E0Nbe8u4i_BYlWsl8Eetz5Rs",
    //     "username": "Коритко Ярослав Миколайович",
    //     "subject": 3,
    //     "__v": 0
    // }

    // Отримуємо всі тести
    const testsResponse = await impHttp.getAllTestsFromDB();
    if (testsResponse.status !== 200) {
        return alert(`Помилка отримання даних тестів: ${testsResponse.data.message}`);
    }

    //console.log(testsResponse);

    const testsInfo = testsResponse.data;

    //console.log(testsInfo);

    // Групуємо відповіді користувачів за тестами
    const groupedByTest = usersAnswers.reduce((acc, userAnswer) => {
        const test = testsInfo.find((t) => t.testId === userAnswer.testId);
        if (!test) return acc;

        if (!acc[test.testId]) {
            acc[test.testId] = {
                testId: test.testId,
                testName: test.name,
                subject: test.subject,
                questions: (() => {
                    try {
                        return JSON.parse(test.questions);
                    } catch (e) {
                        console.error(`Error parsing test questions for testId ${test.testId}:`, e);
                        return [];
                    }
                })(),
                answers: [],
                users: []
            };
        }

        acc[test.testId].answers.push((() => {
            try {
                return JSON.parse(userAnswer.answersArray);
            } catch (e) {
                console.error(`Error parsing user answers for userId ${userAnswer.userid}:`, e);
                return [];
            }
        })());

        acc[test.testId].users.push({
            userid: userAnswer.userid,
            username: userAnswer.username,
            group: userAnswer.group,
            subgroup: userAnswer.subgroup,
            school: userAnswer.school
        });

        //console.log(acc)

        return acc;
    }, {});

    //console.log(groupedByTest);

    // Формуємо дані для кожного тесту
    const testAnalyticsData = Object.entries(groupedByTest).map(([testId, testData]) => {
        const questionStats = {};

        testData.answers.forEach((answersArray, answerIndex) => {
            answersArray.forEach((item) => {
                const questionId = item.question;
                const correctAnswers = testData.questions[questionId]?.correctAnswers || [];

                if (!questionStats[questionId]) {
                    questionStats[questionId] = {
                        total: 0,
                        wrong: 0,
                        wrongUsers: []
                    };
                }

                questionStats[questionId].total += 1;

                // Перевіряємо, чи відповідь неправильна
                const isWrong = item.answer.some((ans, index) => ans !== correctAnswers[index]);
                const userEntry = testData.users[answerIndex] || {};
                const username = userEntry.username || "Unknown User";
                const userId = userEntry.userid || "";

                if (isWrong) {
                    questionStats[questionId].wrong += 1;
                    questionStats[questionId].wrongUsers.push({
                        username,
                        userId,
                        answer: item.answer
                    });
                    questionStats[questionId].wrongUsers.sort((a, b) =>
                        a.username.localeCompare(b.username, 'uk')
                    );
                }
            });
        });

        return {
            testName: testData.testName,
            questions: testData.questions,
            questionStats,
            testId
        };
    });

    //console.log(testAnalyticsData);


    // Очищаємо контейнер
    testAnalyticsContainer.innerHTML = "";
    //console.log(testAnalyticsData);
    // Сортуємо дані за назвою тесту в алфавітному порядку
    testAnalyticsData.sort((a, b) => {
        const getFourthWord = (str) => str.split(' ')[3] || '';
        return getFourthWord(a.testName).localeCompare(getFourthWord(b.testName), 'uk');
    });

    // Додаємо дані для кожного тесту
    testAnalyticsData.forEach((test) => {
        //console.log(test);
        const testSection = document.createElement("div");
        testSection.classList.add("test-section");
        testSection.innerHTML = `
        
                <div class="image-container">
                    <img src="img/visibility.png" alt="Змінити доступність" title="Змінити доступність"  class="admin-page__change-visibility header__img" /> 
                    <a href = "https://docs.google.com/document/d/${test.testId}" target='_blank'><img src="img/materials.png" alt="Переглянути документ" title = "Переглянути документ" class="admin-page__change-visibility header__img" /> </a>
                </div>
                <div class="test-info">
                    <h3 class="test-name">${test.testName}</h3>
                    <div class="test-table"></div>
                </div>
        `;

        // const testTitle = document.createElement("h3");

        // testTitle.innerHTML = `

        // ${test.testName}
        // `;
        // testSection.appendChild(testTitle);

        const testTitle = testSection.querySelector(".test-name");
        const table = document.createElement("table");
        // Додаємо функціонал акордеону
        testTitle.addEventListener("click", () => {
            const isVisible = table.style.display === "block";
            table.style.display = isVisible ? "none" : "block";
        });

        // Початково приховуємо таблицю
        table.style.display = "none";
        table.classList.add("analytics-table");

        let arrayOfEnglishAnswers = ["A", "B", "C", "D", "E", "F", "G", "H"];
        let arrayOfUAAnswers = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж"];
        //${test.testName.indexOf('Англійська')==0 ? 22 :test.questions[parseInt(questionId)].correctAnswers}
        //${test.questionStats[parseInt(questionId)].wrongUsers}
        table.innerHTML = `
            <thead>
                <tr>
                    <th id="">Номер</th>
                    <th id="">Відповіді</th>
                    <th id="">Помилкові</th>
                    <th id="">Засвоєно</th>
                    <th id="">Питання</th>
                    <th id="">Відповідь</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(test.questionStats)
                    .map(
                        ([questionId, stats]) => {
                            const mastery = Math.floor(100 - (stats.wrong / stats.total) * 100);
                            const backgroundColor = `rgba(${255 - (mastery * 2.55)}, ${mastery * 2.55}, 0, 0.3)`;
                            return `
                    <tr>
                        <td>${parseInt(questionId) + 1}</td>
                        <td>${stats.total}</td>
                        <td>
                            <span class="toggle-question">${stats.wrong == 0 ? '' : stats.wrong + ' 👁'}</span>                        
                            <table class="wrong-users-answers-table" style="display: none;">
                                <thead>
                                    <tr>
                                        <th>ПІБ</th>
                                        <th>Відповідь</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${stats.wrongUsers.map(user => `
                                        <tr>
                                            <td>${formatUserLink(user.username, user.userId)}</td>
                                            <td>
                                                ${user.answer.map((answer, index) => {
                                const isCorrect = test.questions[parseInt(questionId)].correctAnswers[index] === answer;
                                const formattedAnswer = test.testName.includes('Англійська') && arrayOfUAAnswers.includes(answer)
                                    ? arrayOfEnglishAnswers[arrayOfUAAnswers.indexOf(answer)]
                                    : answer;
                                return `<span style="color: ${isCorrect ? 'black' : 'red'};">${formattedAnswer}</span>`;
                            }).join(", ")}
                                            </td>
                                        </tr>`).join("")}
                                </tbody>
                            </table>
                        </td>
                        <td style="background-color: ${backgroundColor};">${mastery}%</td>
                        <td>
                            <div class="toggle-question">👁</div>
                            <div class="question-body" style="display: none;">${test.questions[parseInt(questionId)].body}</div>
                        </td>
                        <td>
                            <div class="toggle-question">👁</div>
                            <div class="question-body" style="display: none;">
                                ${test.questions[parseInt(questionId)].correctAnswers.map(answer => {
                                const formattedAnswer = test.testName.includes('Англійська') && arrayOfUAAnswers.includes(answer)
                                    ? arrayOfEnglishAnswers[arrayOfUAAnswers.indexOf(answer)]
                                    : answer;
                                return formattedAnswer;
                            }).join(", ")}
                            </div>
                        </td>
                    </tr>
                `;
                        }
                    )
                    .join("")}
            </tbody>
        `;

        // Додаємо обробники подій для відображення/приховування питання
        table.querySelectorAll(".toggle-question").forEach((toggle, index) => {
            toggle.addEventListener("click", () => {
                const questionBody = toggle.nextElementSibling;
                questionBody.style.display = questionBody.style.display === "none" ? "block" : "none";
            });
        });

        // Додаємо обробники подій для зміни доступності тестів
        let updateStatusButton = testSection.querySelector(
            ".admin-page__change-visibility"
          );

          if (updateStatusButton) {
            updateStatusButton.addEventListener("click", async function () {
                
        
              let testData = await impHttp.getTestById([test.testId]);
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
                //console.log("testData", testData);
        
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

                

                testSection.querySelector(".test-name").innerText = test.data.name;
              });
              let noButton = popupObj.noButton;
              noButton.addEventListener("click", async function (e) {
                e.preventDefault();
                popupObj.popup.remove();
              });
            });
          }


        testSection.querySelector(".test-table").appendChild(table);
        testAnalyticsContainer.appendChild(testSection);
    });

}

const scriptUrl = "https://script.google.com/macros/s/AKfycbwBOiI9Vic2eHDvPTTMqi0C6rI4TjcWZ0_a6LiRvx5X5iHaw6iyWC7i5BVowEsjkxn8/exec";

document.querySelector('.analizeTests').addEventListener("click", () => {
    // Викликаємо функцію для генерації аналітики
    generateTestAnalytics();
});
