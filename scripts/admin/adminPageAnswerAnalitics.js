import * as impHttp from "../http/api-router.js";
// Ensure analytics is generated for each test separately
document.querySelector('.analizeTests').addEventListener("click", () => {
    generateTestAnalytics();
});
async function generateTestAnalytics() {
  const testAnalyticsContainer = document.querySelector(".test-analytics");
  if (!testAnalyticsContainer) {
    return alert("Помилка! Блок аналітики не знайдено");
  }

  // Отримуємо всі відповіді користувачів
  const usersAnswersResponse = await impHttp.getAllUserAnswers();
  if (usersAnswersResponse.status !== 200) {
    return alert(`Помилка отримання даних: ${usersAnswersResponse.data.message}`);
  }
  const usersAnswers = usersAnswersResponse.data;

  // Отримуємо всі тести
  const testsResponse = await impHttp.getAllTestsFromDB();
  if (testsResponse.status !== 200) {
    return alert(`Помилка отримання даних тестів: ${testsResponse.data.message}`);
  }
  const testsInfo = testsResponse.data;
  
  //console.log(testsInfo);

// Групуємо відповіді користувачів за тестами
const groupedByTest = usersAnswers.reduce((acc, userAnswer) => {
    const test = testsInfo.find((t) => t.testId === userAnswer.testId);
    if (!test) return acc;

    if (!acc[test.testId]) {
        acc[test.testId] = {
            testId: test.testId,
            testName: test.subjectName + " " + test.name.split(' ')[2],
            questions: JSON.parse(test.questions),
            answers: [],
        };
    }

    acc[test.testId].answers.push(JSON.parse(userAnswer.answersArray));
    return acc;
}, {});

// Формуємо дані для кожного тесту
const testAnalyticsData = Object.entries(groupedByTest).map(([testId, testData]) => {
    const questionStats = {};

    //console.log(testData);

    testData.answers.forEach((answersArray) => {
        answersArray.forEach((item) => {
            const questionId = item.question;
            const correctAnswers = testData.questions[questionId]?.correctAnswers || [];

            if (!questionStats[questionId]) {
                questionStats[questionId] = { total: 0, wrong: 0 };
            }

            questionStats[questionId].total += 1;

            // Перевіряємо, чи відповідь неправильна
            const isWrong = item.answer.some((ans, index) => ans !== correctAnswers[index]);
            if (isWrong) {
                questionStats[questionId].wrong += 1;
            }
        });
    });

    //console.log(testsInfo);

    return {
        testName: testData.testName,
        questions: testData.questions,
        questionStats,
        testId        
    };
});

// Очищаємо контейнер
testAnalyticsContainer.innerHTML = "";
//console.log(testAnalyticsData);
// Сортуємо дані за назвою тесту в алфавітному порядку
testAnalyticsData.sort((a, b) => a.testName.localeCompare(b.testName, 'uk'));

// Додаємо дані для кожного тесту
testAnalyticsData.forEach((test) => {
    console.log(test);
    const testSection = document.createElement("div");
    testSection.classList.add("test-section");

    const testTitle = document.createElement("h3");
    
    testTitle.innerHTML = ` <a href = "https://docs.google.com/document/d/${test.testId}" target='_blank'>👁 </a>${test.testName}`;
    testSection.appendChild(testTitle);

    
    const table = document.createElement("table");
    // Додаємо функціонал акордеону
    testTitle.addEventListener("click", () => {
        const isVisible = table.style.display === "block";
        table.style.display = isVisible ? "none" : "block";
    });

    // Початково приховуємо таблицю
    table.style.display = "none";
    table.classList.add("analytics-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>Номер питання</th>
                <th>Кількість відповідей</th>
                <th>Кількість неправильних відповідей</th>
                <th>Засвоєно</th>
                <th>Питання</th>
                <th>Відповідь</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(test.questionStats)
                .map(
                    ([questionId, stats]) => `
                <tr>
                    <td>${parseInt(questionId) + 1}</td>
                    <td>${stats.total}</td>
                    <td>${stats.wrong}</td>
                    <td>${Math.floor(100-stats.wrong/stats.total*100)}%</td>
                    <td >
                        <div class="toggle-question" style="cursor: pointer;">👁</div>
                        <div class="question-body" style="display: none;">${test.questions[parseInt(questionId)].body}</div>
                    </td>
                    <td>
                        <div class="toggle-question" style="cursor: pointer;">👁</div>
                        <div class="question-body" style="display: none;">${test.questions[parseInt(questionId)].correctAnswers}</div>
                    </td>
                </tr>
            `
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

    testSection.appendChild(table);
    testAnalyticsContainer.appendChild(testSection);
});
  

}

document.querySelector('.analizeTests').addEventListener("click", () => {
  // Викликаємо функцію для генерації аналітики
  generateTestAnalytics();
});
