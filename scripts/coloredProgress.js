// Функція для оновлення якості проходження
function updateQuality() {
  // Отримати всі елементи з класом 'admin-page__user-current-test-progress-item'
  const allItems = document.querySelectorAll('.admin-page__user-current-test-progress-item.passed');

  // Підрахувати кількість з класом 'answer_wrong-with-bg'
  const wrongCount = document.querySelectorAll('.admin-page__user-current-test-progress-item.answer_wrong-with-bg').length;

  // Підрахувати загальну кількість
  const totalCount = allItems.length;
  //console.log('totalCount - ', totalCount);

  // Розрахувати відсоток правильного проходження
  const percentage = totalCount ? ((totalCount - wrongCount) / totalCount) * 100 : 0;

  // Знайти кнопку з класом 'admin-page__refresh-button'
  const refreshButton = document.querySelector('.admin-page__refresh-button');

  // Оновити текст і стиль кнопки
  if (refreshButton) {
    const red = Math.round(200 * (1 - percentage / 100));
    const green = Math.round(200 * (percentage / 100));
    refreshButton.textContent = `Якість проходження: ${percentage.toFixed(2)}%`;
    refreshButton.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
  } else {
    console.warn("Кнопка з класом 'admin-page__refresh-button' не знайдена.");
  }
  calculateTestCompletionPercentage()
  
}
//calculateTestCompletionPercentage()
// Запустити оновлення з інтервалом 10 секунд
setInterval(updateQuality, 1000);
// Запустити оновлення з інтервалом 10 секунд
//setInterval(calculateTestCompletionPercentage, 1000);

// Викликати функцію один раз при завантаженні сторінки
updateQuality();

function calculateTestCompletionPercentage() {
  // Отримати всі елементи h3 (заголовки для предметів)
  const subjectH3 = document.querySelectorAll('h3');

  // Обійти кожен заголовок і розрахувати його дані
  subjectH3.forEach(h3 => {
    // Перевірити, чи існує span для результату всередині h3
    let resultSpan = h3.querySelector('.result-span');
    if (!resultSpan) {
      // Якщо span не існує, створити його
      resultSpan = document.createElement('span');
      resultSpan.classList.add('result-span'); // Додати клас для ідентифікації
      resultSpan.style.marginLeft = '10px'; // Додати відступ для краси
      h3.appendChild(resultSpan); // Додати span до h3
    }

    // Отримати всі тести у відповідному блоці
    const tests = h3.parentNode.querySelectorAll('.admin-page__user-current-test-progress-item');
    const wrongTests = h3.parentNode.querySelectorAll('.admin-page__user-current-test-progress-item.answer_wrong-with-bg');

    // Підрахунок
    const totalCount = tests.length;
    const wrongCount = wrongTests.length;

    // Розрахувати відсоток
    const percentage = totalCount ? ((totalCount - wrongCount) / totalCount) * 100 : 0;

    // Округлення до двох десяткових
    const roundedPercentage = Math.round(percentage * 100) / 100;

    // Оновити текст span
    const red = Math.round(200 * (1 - roundedPercentage / 100));
    const green = Math.round(200 * (roundedPercentage / 100));
    resultSpan.style.color = `(0, 0, 0)`;
    
    resultSpan.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
    resultSpan.textContent = `${roundedPercentage}%`;
  });
}
