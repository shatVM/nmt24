export function createAdminHeader(role) {
  let header = document.querySelector(".header__content");
  if (!header) {
    return;
  }
  let admin_controlls = header.querySelector(".header__admin-controlls");
  if (!admin_controlls) {
    return;
  }

  console.log("createAdminHeader", role);



  let admin_controllsMenu = `        
  <div class="hiden_admin_menu">
    <a href="materials.html" class="hiden_admin_menu_item" target="_blank">
      <img
      src="img/materials.png"             
      alt="Матеріали"
      class="header__img"
      title="Матеріали"
      />
    </a>
    <a href="profile.html" class="hiden_admin_menu_item">
      <img
      src="img/profile-icon.png"
      alt="Профіль"
      class="header__img"
      title="Профіль"
      />
    </a>          
    <a href="adminPageUserProgress.html" class="hiden_admin_menu_item">
      <img
      src="img/user-progress.png"
      alt="Прогрес"
      class="header__img"
      title="Прогрес"
      />
    </a>
    <a href="youtube.html" class="hiden_admin_menu_item">
        <img
        src="img/youtube.png"
        alt="Трансляція"
        class="header__img"
        title="Трансляція"
        />
    </a>
    <a href="adminPage.html" class="hiden_admin_menu_item">
        <img
        src="img/admin.png"
        alt="Результати"
        class="header__img"
        title="Результати"
        />
    </a>
    <a href="adminPageTests.html" class="hiden_admin_menu_item">
        <img
        src="img/tests.png"
        alt="Тести"
        class="header__img"
        title="Тести"
        />
    </a>
        <a href="adminPageAnswerAnalitics.html" class="hiden_admin_menu_item">
        <img
        src="img/visibility.png"
        alt="Аналітика"
        class="header__img"
        title="Аналітика"
        />
    </a>
  </div>
  
`

let teacher_controllsMenu = `        
  <div class="hiden_admin_menu">
    <a href="materials.html" class="hiden_admin_menu_item" target="_blank">
      <img
      src="img/materials.png"             
      alt="Матеріали"
      class="header__img"
      title="Матеріали"
      />
    </a>
    <a href="profile.html" class="hiden_admin_menu_item">
      <img
      src="img/profile-icon.png"
      alt="Профіль"
      class="header__img"
      title="Профіль"
      />
    </a>          
    <a href="adminPageUserProgress.html" class="hiden_admin_menu_item">
      <img
      src="img/user-progress.png"
      alt="Прогрес"
      class="header__img"
      title="Прогрес"
      />
    </a>
    <a href="youtube.html" class="hiden_admin_menu_item">
        <img
        src="img/youtube.png"
        alt="Трансляція"
        class="header__img"
        title="Трансляція"
        />
    </a>
    <a href="adminPage.html" class="hiden_admin_menu_item">
        <img
        src="img/admin.png"
        alt="Результати"
        class="header__img"
        title="Результати"
        />
    </a>
    </a>
        <a href="adminPageAnswerAnalitics.html" class="hiden_admin_menu_item">
        <img
        src="img/visibility.png"
        alt="Аналітика"
        class="header__img"
        title="Аналітика"
        />
    </a>
  </div>
  
`

  let user_controllsMenu = `
  <div class="hiden_admin_menu">
    <a href="materials.html" class="hiden_admin_menu_item" target="_blank">
      <img
      src="img/materials.png"             
      alt="Матеріали"
      class="header__img"
      title="Матеріали"
      />
    </a>
    <a href="profile.html" class="hiden_admin_menu_item">
      <img
      src="img/profile-icon.png"
      alt="Профіль"
      class="header__img"
      title="Профіль"
      />
    </a>        
  `   
if (role == "ADMIN") {  
  admin_controlls.innerHTML = admin_controllsMenu ;
} else if(role == "TEACHER")  {
    admin_controlls.innerHTML = teacher_controllsMenu ;
  }
  else {
  admin_controlls.innerHTML = user_controllsMenu ;
}
  //admin_controlls.innerHTML = admin_controllsMenu ;
  // let publicProfileButton = document.getElementsByClassName("profile-button")[0];
  // if (publicProfileButton) {
  //   publicProfileButton.parentNode.removeChild(publicProfileButton)
  // }
}
