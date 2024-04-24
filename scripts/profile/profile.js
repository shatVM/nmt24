import * as impHttp from "../http/api-router.js";
import { client_url } from "../dev/config.js";

profilePage();

async function profilePage() {
  let authResponse = await impHttp.isAuth();

  if (authResponse.status == 200) {
    let profileInfo = authResponse.data;

    openProfilePage(profileInfo);
  } else {
    location.href = client_url;
  }
}

export function openProfilePage(profileInfo) {
  let profileInfoBlock = document.querySelector(".profile-info");
  if (!profileInfoBlock) {
    return;
  }

  let profileBody = profileInfoBlock.querySelector(".profile-info_body");
  if (!profileBody) {
    return;
  }
  profileBody.innerHTML = `
    <h2 class="profile-info-title profile-info__name">
    ${profileInfo.name}
    </h2>
    <p class="profile-info-text profile-info__email">
    Email: ${profileInfo.email}
    </p>
    <p class="profile-info-text profile-info__educationOrg">
    Заклад освіти: ${profileInfo.educationOrg}
    </p>
    <p class="profile-info-text profile-info__group">Група: ${profileInfo.group}</p>
    <p class="profile-info-text profile-info__passedTestsNumber">
    Пройдено тестів: ${profileInfo.passedTestsNumber}
    </p>
    <p class="profile-info-text profile-info__testLimit">
    Залишилось спроб: ${profileInfo.testLimit}
    </p>
  `;

  let logoutButton = document.querySelector(".logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("token");
      location.href = client_url;
    });
  }
}
