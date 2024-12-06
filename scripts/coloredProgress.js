// Функція для оновлення якості проходження
function updateQuality() {
  // Отримати всі елементи з класом 'admin-page__user-current-test-progress-item'
  const allItems = document.querySelectorAll('.admin-page__user-current-test-progress-item');

  // Отримати елементи, які також мають клас 'answer_wrong-with-bg'
  const wrongItems = document.querySelectorAll('.admin-page__user-current-test-progress-item.answer_wrong-with-bg');

  // Підрахувати загальну кількість
  const totalCount = allItems.length;

  // Підрахувати кількість з класом 'answer_wrong-with-bg'
  const wrongCount = wrongItems.length;
 
  // Розрахувати відсоток правильного проходження
  const percentage = ((totalCount - wrongCount) / totalCount) * 100;
  console.log('totalCount - ', totalCount)
  console.log('wrongCount - ', wrongCount)
  console.log('percentage - ', percentage)
  // Знайти кнопку з класом 'admin-page__refresh-button'
  const refreshButton = document.querySelector('.admin-page__refresh-button');

  // Функція для отримання кольору на основі відсотка
  function getColor(percentage) {
    const red = Math.round(200 * (1 - percentage / 100)); // Чим менше %, тим більше червоного
    const green = Math.round(200 * (percentage / 100)); // Чим більше %, тим більше зеленого
    return `rgb(${red}, ${green}, 0)`; // Створення кольору у форматі RGB
  }

  // Оновити текст і стиль кнопки
  if (refreshButton) {
    refreshButton.textContent = `Якість проходження: ${percentage.toFixed(2)}%`;
    refreshButton.style.backgroundColor = getColor(percentage); // Задаємо фон кнопки
    // refreshButton.style.color = 'white'; // Зробимо текст читабельним
  } else {
    console.warn("Кнопка з класом 'admin-page__refresh-button' не знайдена.");
  }
}

// Запустити оновлення з інтервалом 10 секунд
setInterval(updateQuality, 10000);

// Викликати функцію один раз при завантаженні сторінки
updateQuality();

