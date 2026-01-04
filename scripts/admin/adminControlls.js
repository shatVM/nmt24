export function createAdminHeader(role) {
  const header = document.querySelector(".header__content");
  if (!header) {
    return;
  }
  const adminControls = header.querySelector(".header__admin-controlls");
  if (!adminControls) {
    return;
  }

  console.log("createAdminHeader", role);

  const logoBlock = `
    <a href="index.html" class="header__logo">
      <img src="img/logo.png" alt="logo" />
    </a>
  `;

  const baseItems = [
    { href: "materials.html", label: "Матеріали", icon: "img/materials.png", external: true },
    { href: "profile.html", label: "Профіль", icon: "img/profile-icon.png" },
  ];

  const teacherItems = [
    ...baseItems,
    { href: "adminPageUserProgress.html", label: "Прогрес", icon: "img/user-progress.png" },
    { href: "youtube.html", label: "Трансляція", icon: "img/youtube.png" },
    { href: "adminPage.html", label: "Результати", icon: "img/admin.png" },
    { href: "adminPageAnswerAnalitics.html", label: "Аналітика", icon: "img/visibility.png" },
  ];

  const adminItems = [
    ...teacherItems,
    { href: "adminPageTests.html", label: "Тести", icon: "img/tests.png" },
    { href: "adminPageUsers.html", label: "Користувачі", icon: "img/profile-icon.png" },
  ];

  const items = role === "ADMIN" ? adminItems : role === "TEACHER" ? teacherItems : baseItems;

  adminControls.innerHTML = `
    <div class="header__bar">
      ${logoBlock}
      <nav class="header__nav">
        ${items
          .map(
            (item) => `
          <a href="${item.href}" class="header__nav-item"${item.external ? ' target="_blank"' : ""}>
            <span class="header__nav-icon">
              <img src="${item.icon}" alt="${item.label}" />
            </span>
            <span class="header__nav-text">${item.label}</span>
          </a>
        `
          )
          .join("")}
      </nav>
    </div>
  `;
}
