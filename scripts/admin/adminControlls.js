export function createAdminHeader() {
  let header = document.querySelector(".header__content");
  if (!header) {
    return;
  }
  let admin_controlls = header.querySelector(".header__admin-controlls");
  if (!admin_controlls) {
    return;
  }
  admin_controlls.innerHTML = ` 
        <a href="adminPageUserProgress.html" class="">
          <img
          src="img/user-progress.png"
          alt="Прогрес"
          class="header__img"
          title="Прогрес"
          />
        </a>
        <a href="youtube.html" class="">
            <img
            src="img/youtube.png"
            alt="Трансляція"
            class="header__img"
            title="Трансляція"
            />
        </a>
        <a href="adminPage.html" class="">
            <img
            src="img/admin.png"
            alt="Результати"
            class="header__img"
            title="Результати"
            />
        </a>
        <a href="adminPageTests.html" class="">
            <img
            src="img/tests.png"
            alt="Тести"
            class="header__img"
            title="Тести"
            />
        </a>
        
  `;
}
