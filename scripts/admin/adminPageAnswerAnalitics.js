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

// Групуємо відповіді користувачів за тестами
const groupedByTest = usersAnswers.reduce((acc, userAnswer) => {
    const test = testsInfo.find((t) => t.testId === userAnswer.testId);
    if (!test) return acc;

    if (!acc[test.testId]) {
        acc[test.testId] = {
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

    return {
        testName: testData.testName,
        questionStats,
    };
});

// Очищаємо контейнер
testAnalyticsContainer.innerHTML = "";
console.log(testAnalyticsData);

// Додаємо дані для кожного тесту
testAnalyticsData.forEach(({ testName, questionStats }) => {
    const testSection = document.createElement("div");
    testSection.classList.add("test-section");

    const testTitle = document.createElement("h3");
    testTitle.textContent = `Тест: ${testName}`;
    testSection.appendChild(testTitle);

    
    const table = document.createElement("table");
    table.classList.add("analytics-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>Номер питання</th>
                <th>Кількість відповідей</th>
                <th>Кількість неправильних відповідей</th>
                <th>Засвоєно</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(questionStats)
                .map(
                    ([questionId, stats]) => `
                <tr>
                    <td>${parseInt(questionId) + 1}</td>
                    <td>${stats.total}</td>
                    <td>${stats.wrong}</td>
                    <td>${Math.floor(100-stats.wrong/stats.total*100)}%</td>
                </tr>
            `
                )
                .join("")}
        </tbody>
    `;

    testSection.appendChild(table);
    testAnalyticsContainer.appendChild(testSection);
});
  

}

document.querySelector('.analizeTests').addEventListener("click", () => {
  // Викликаємо функцію для генерації аналітики
  generateTestAnalytics();
});
