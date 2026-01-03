import * as impPopups from "./components/popups.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";

// Ініціалізація сторінки
adminLogin();
initStaticEventListeners();

/**
 * Форматує час у хвилини та секунди.
 * @param {number} startTime - Початковий час у мілісекундах.
 * @returns {string} - Відформатований час у форматі "ХХ:ХХ".
 */
function formatTime(startTime) {
    if (!startTime) return "";
    const ms = Date.now() - startTime;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Перевіряє, чи авторизований користувач як адміністратор.
 */
async function adminLogin() {
    const loginForm = document.querySelector(".admin-page__login");
    if (!loginForm) return;

    try {
        const authResponse = await impHttp.isAuth();
        if (authResponse.status === 200 && hasAdminAccess()) {
            loginForm.remove();
            await adminPage();
            initRefreshing(); // Запускаємо оновлення тільки після успішного входу
        } else if (authResponse.status !== 200) {
            setupLoginForm(loginForm);
        } else {
            redirectToHome("У вас немає прав адміністратора");
        }
    } catch (error) {
        console.error("Помилка автентифікації:", error);
        setupLoginForm(loginForm);
    }
}

/**
 * Перевіряє, чи має користувач права адміністратора або вчителя.
 * @returns {boolean} - true, якщо користувач має відповідні права.
 */
function hasAdminAccess() {
    return ["ADMIN", "TEACHER"].some(role => window?.userInfo?.roles?.includes(role));
}

/**
 * Перенаправляє на головну сторінку з повідомленням.
 * @param {string} message - Повідомлення для відображення.
 */
function redirectToHome(message) {
    location.href = importConfig.client_url;
    alert(message);
}

/**
 * Налаштовує обробник подій для форми входу.
 * @param {HTMLElement} loginForm - Елемент форми входу.
 */
function setupLoginForm(loginForm) {
    const button = loginForm.querySelector(".admin-page__login-submit");
    button.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = document.querySelector(".admin-page-email").value;
        const password = document.querySelector(".admin-page-password").value;
        try {
            const loginResponse = await impHttp.login(email, password);
            if (loginResponse.status === 200) {
                loginForm.remove();
                await adminPage();
                initRefreshing();
            }
        } catch (error) {
            console.error("Помилка входу:", error);
            alert("Неправильний логін або пароль.");
        }
    });
}

/**
 * Основна функція для сторінки адміністратора.
 */
async function adminPage() {
    await appendData();
    initTimer();
}

/**
 * Отримує та відображає дані про користувачів, які проходять тести (оптимізовано).
 */
async function appendData() {
    try {
        const { data: users } = await impHttp.getAllCurrentPassingUsers();
        const usersContainer = document.querySelector(".admin-page__users");
        
        if (users.length === 0) {
            usersContainer.innerHTML = "<h4>Зараз немає користувачів, які проходять тести</h4>";
            updateH2Count();
            return;
        }

        const testIds = [...new Set(users.flatMap(user => user.tests.map(test => test.testId)))];
        const testsInfo = await getTestsInformation(testIds);
        
        const correctAnswersMap = new Map(testsInfo.map(test => [
            test.testId,
            JSON.parse(test.questions || "[]").map(q => q.correctAnswers)
        ]));

        const userEmailsOnPage = new Set([...usersContainer.querySelectorAll(".admin-page__users-user")].map(el => el.dataset.userEmail));
        const incomingUserEmails = new Set(users.map(u => u.email));

        // Видалення користувачів, яких більше немає в списку
        for (const email of userEmailsOnPage) {
            if (!incomingUserEmails.has(email)) {
                usersContainer.querySelector(`[data-user-email="${email}"]`)?.remove();
            }
        }

        // Оновлення та додавання користувачів
        users.sort((a, b) => a.name.localeCompare(b.name, 'uk'));

        for (const user of users) {
            const existingUserBlock = usersContainer.querySelector(`[data-user-email="${user.email}"]`);

            if (existingUserBlock) {
                // Оновлюємо існуючий блок, щоб не втрачати стан (наприклад, чи згорнутий він)
                const timeElement = existingUserBlock.querySelector('.admin-page__user-test-time');
                if (timeElement) timeElement.innerHTML = `🚀 ${new Date(user.testStartTime).toLocaleString()} 🕗 ${formatTime(user.testStartTime)}`;
                
                const summaryContainer = existingUserBlock.querySelector('.user-progress-summary');
                if (summaryContainer) summaryContainer.innerHTML = createProgressSummaryItemsHTML(user.tests, correctAnswersMap);

                const testsContainer = existingUserBlock.querySelector('.admin-page__user-tests-container');
                if(testsContainer) testsContainer.innerHTML = createAllTestBlocksHTML(user.tests, correctAnswersMap);

            } else {
                // Додаємо нового користувача
                const userBlockHTML = createUserBlockHTML(user, correctAnswersMap);
                usersContainer.insertAdjacentHTML('beforeend', userBlockHTML);
            }
        }

        if (usersContainer.querySelector('h4')) {
            usersContainer.querySelector('h4').remove();
        }

    } catch (error) {
        console.error("Помилка при оновленні даних:", error);
    } finally {
        updateH2Count();
    }
}

/**
 * Створює HTML-рядок з коротким оглядом прогресу тестів.
 * @param {Array} tests - Масив тестів користувача.
 * @param {Map} correctAnswersMap - Map з правильними відповідями.
 * @returns {string} - HTML-рядок.
 */
function createProgressSummaryItemsHTML(tests, correctAnswersMap) {
    return tests.map(test => {
        const correctAnswersForTest = correctAnswersMap.get(test.testId) || [];
        const totalQuestions = test.answers.length;
        const submittedCount = test.answers.filter(a => a.submitted).length;
        const shortTestName = test.name.split(' ').slice(2).join(' ');

        const progressText = `
            <span class="test-summary__progress">
                <span class="test-summary__test-name">${shortTestName}</span>
                <span>(${submittedCount}/${totalQuestions})</span>
            </span>
        `;

        if (totalQuestions === 0) {
            return `<span class="test-summary">${progressText}</span>`;
        }

        if (submittedCount === 0) {
            return `<span class="test-summary">${progressText}</span>`;
        }

        let correctCount = 0;
        test.answers.forEach((answer, index) => {
            if (answer.submitted) {
                const correctAnswerArr = correctAnswersForTest[index] || [];
                const isCorrect = answer.answer.every((item, idx) => item === correctAnswerArr[idx]);
                if (isCorrect) {
                    correctCount++;
                }
            }
        });

        const percentage = Math.round((correctCount / submittedCount) * 100);
        
        const red = 255 - (percentage * 2.55);
        const green = percentage * 2.55;
        const backgroundColor = `rgba(${red}, ${green}, 0, 0.3)`;

        const percentageSpan = `<span class="result-span" style="margin-left: 10px; background-color: ${backgroundColor}; color: black; padding: 2px 5px; border-radius: 3px;">${percentage}%</span>`;

        return `<span class="test-summary">${progressText} ${percentageSpan}</span>`;
    }).join('');
}

/**
 * Створює HTML-рядок для блоку одного користувача.
 * @param {Object} user - Об'єкт користувача.
 * @param {Map} correctAnswersMap - Map з правильними відповідями.
 * @returns {string} - HTML-рядок.
 */
function createUserBlockHTML(user, correctAnswersMap) {
    const progressSummaryHTML = createProgressSummaryItemsHTML(user.tests, correctAnswersMap);
    const userId = user.id || user.userId || user._id || "";
    const userName = user.name || "";
    const userLink = userId
        ? `<a class="admin-user-link" href="adminPageUsers.html?userId=${encodeURIComponent(userId)}">${userName}</a>`
        : userName;
    return `
    <div class="admin-page__users-user" data-user-email="${user.email}">
      <div class="admin-page__users-info result-item">
        <div class="result-item__name_block">
          <input type='checkbox' class='delete-check-box test-check-box'>
          <h2 class="result-item__name">${userLink}</h2>
          <div class="user-progress-summary">${progressSummaryHTML}</div>
        </div>
        <div class="admin-page__user-test-time">🚀 ${new Date(user.testStartTime).toLocaleString()} 🕗 ${formatTime(user.testStartTime)}</div>
        <div>
          
          <button class="admin-page__delete result-item__name_btn_remove" data-user-name="${user.name}">Видалити</button>
          <button class="admin-page__btn_finish result-item__name_btn_finish" data-user-name="${user.name}">Завершити</button>
        </div>
      </div>
      <div class="admin-page__user-tests-container" style="display: none;">
        ${createAllTestBlocksHTML(user.tests, correctAnswersMap)}
      </div>
    </div>`;
}

/**
 * Створює HTML-рядки для всіх тестів одного користувача.
 * @param {Array} tests - Масив тестів користувача.
 * @param {Map} correctAnswersMap - Map з правильними відповідями.
 * @returns {string} - HTML-рядок.
 */
function createAllTestBlocksHTML(tests, correctAnswersMap) {
    return tests.map(test => {
        const correctAnswers = correctAnswersMap.get(test.testId) || [];
        
        let submittedCount = 0;
        let correctCount = 0;

        const progressItemsHTML = test.answers.map((answer, index) => {
            const correctAnswerArr = correctAnswers[index] || [];
            let isCorrect = false;
            if (answer.submitted) {
                submittedCount++;
                isCorrect = answer.answer.every((item, idx) => item === correctAnswerArr[idx]);
                if (isCorrect) {
                    correctCount++;
                }
            }
            const itemClass = `admin-page__user-current-test-progress-item ${answer.submitted ? "passed" : ""} ${answer.submitted && !isCorrect ? "answer_wrong-with-bg" : ""}`;
            return `<div class="${itemClass}">${answer.question + 1}</div>`;
        }).join('');

        let percentageSpan = '';
        if (submittedCount > 0) {
            const percentage = Math.round((correctCount / submittedCount) * 100);
            const red = 255 - (percentage * 2.55);
            const green = percentage * 2.55;
            const backgroundColor = `rgba(${red}, ${green}, 0, 0.3)`;
            percentageSpan = `<span class="result-span" style="margin-left: 10px; background-color: ${backgroundColor}; color: black; padding: 2px 5px; border-radius: 3px;">${percentage}%</span>`;
        }

        return `
        <div class="admin-page__users-test">
          <h3>${test.name}${percentageSpan}</h3>
          <div class="admin-page__user-current-test-progress" data-test-id="${test.testId}">
            ${progressItemsHTML}
          </div>
        </div>`;
    }).join('');
}

/**
 * Отримує інформацію про тести з бази даних.
 * @param {Array} testIds - Масив ID тестів.
 * @returns {Promise<Array>} - Масив з даними тестів.
 */
async function getTestsInformation(testIds) {
    if (testIds.length === 0) return [];
    try {
        const response = await impHttp.getAllTestsFromDB(testIds);
        if (response.status !== 200) {
            throw new Error(`Помилка отримання даних: ${response.data.message}`);
        }
        return response.data;
    } catch (error) {
        console.error(error);
        alert(error.message);
        return [];
    }
}

/**
 * Ініціалізує статичні обробники подій (делегування).
 */
function initStaticEventListeners() {
    const usersContainer = document.querySelector(".admin-page__users");
    usersContainer.addEventListener("click", async (event) => {
        const target = event.target;

        // Toggle user test details visibility
        const infoBlock = target.closest('.admin-page__users-info');
        if (infoBlock && !target.closest('button, input, a')) {
            const userBlock = infoBlock.closest('.admin-page__users-user');
            const testsContainer = userBlock?.querySelector('.admin-page__user-tests-container');
            if (testsContainer) {
                const isHidden = testsContainer.style.display === 'none' || testsContainer.style.display === '';
                testsContainer.style.display = isHidden ? 'flex' : 'none';
            }
        }

        // Кнопка видалення
        if (target.classList.contains("result-item__name_btn_remove")) {
            const userBlock = target.closest('.admin-page__users-user');
            const userName = target.dataset.userName;
            const userEmail = userBlock?.dataset.userEmail;
            if (userName && userEmail) {
                confirmUserRemoval(userBlock, userName, userEmail);
            }
        }
    });

    const refreshButton = document.querySelector(".admin-page__refresh-button");
    refreshButton.addEventListener("click", () => adminPage());

    const collapseAllButton = document.querySelector(".admin-page__collapse-all-button");
    collapseAllButton.addEventListener("click", () => {
        const allTestsContainers = document.querySelectorAll('.admin-page__user-tests-container');
        // If any container is not hidden, we will collapse all. Otherwise, we expand all.
        const shouldCollapse = [...allTestsContainers].some(container => container.style.display !== 'none');
        
        const newDisplay = shouldCollapse ? 'none' : 'flex';
        const buttonText = shouldCollapse ? 'Розгорнути всіх' : 'Згорнути всіх';

        allTestsContainers.forEach(container => {
            container.style.display = newDisplay;
        });

        collapseAllButton.textContent = buttonText;
    });
}

/**
 * Відображає спливаюче вікно для підтвердження видалення користувача.
 * @param {HTMLElement} userBlock - Блок користувача.
 * @param {string} name - Ім'я користувача.
 * @param {string} email - Email користувача.
 */
function confirmUserRemoval(userBlock, name, email) {
    const popupText = `Видалити користувача <h2>${name}?</h2>`;
    const popupObj = impPopups.yesNoPopup(popupText);
    document.querySelector("main").appendChild(popupObj.popup);

    popupObj.yesButton.addEventListener("click", async (e) => {
        e.preventDefault();
        popupObj.popup.remove();
        try {
            const response = await impHttp.removeCurrentPassingUserByEmail(email);
            if (response.status === 200) {
                userBlock.remove();
                updateH2Count();
            } else {
                alert("Помилка видалення!");
            }
        } catch (error) {
            console.error("Помилка при видаленні:", error);
            alert("Помилка видалення!");
        }
    });

    popupObj.noButton.addEventListener("click", (e) => {
        e.preventDefault();
        popupObj.popup.remove();
    });
}

/**
 * Ініціалізує таймер на сторінці.
 */
function initTimer() {
    const timerButton = document.querySelector(".admin-page__timer-button");
    if (!timerButton || timerButton.dataset.initialized) return;

    let timer = 60;
    timerButton.textContent = timer;
    timerButton.dataset.initialized = "true";

    setInterval(() => {
        timerButton.textContent = timer;
        timer = (timer > 0) ? timer - 1 : 60;
    }, 1000);
}

/**
 * Оновлює лічильник користувачів, які проходять тестування.
 */
function updateH2Count() {
    const h2Count = document.querySelectorAll(".admin-page__users-user").length;
    document.querySelector(".admin-page__count-button").textContent = "Тестуються: " + h2Count;
}

/**
 * Ініціалізує автоматичне оновлення сторінки.
 */
function initRefreshing() {
    setInterval(adminPage, 60000);
}
