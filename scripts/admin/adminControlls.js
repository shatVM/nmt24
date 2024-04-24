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
  
        <a href="./profile.html" class="profile-button">
            <img
            src="img/profile-icon.png"
            alt="Профіль"
            class="header__img"
            title="Профіль"
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
            alt="Адміністратор"
            class="header__img"
            title="Адміністратор"
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
