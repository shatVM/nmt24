import * as impHttp from "../http/api-router.js";
import { client_url } from "../dev/config.js";
import * as impCreateAnswers from "../components/createAnswersBlock.js";

profilePage();

async function profilePage() {
  let authResponse = await impHttp.isAuth();

  if (authResponse.status == 200) {
    let profileInfo = authResponse.data;

    await openProfilePage(profileInfo);
  } else {
    location.href = client_url;
  }
}


export async function openProfilePage(profileInfo) {
  let testsInfo = [];
  let profileInfoBlock = document.querySelector(".profile-info");
  if (!profileInfoBlock) {
    return;
  }

  let profileBody = profileInfoBlock.querySelector(".profile-info_body");
  if (!profileBody) {
    return;
  }
  let imgString = "";
  if (profileInfo.profilePictureURL != "") {
    imgString = `<img src="${profileInfo.profilePictureURL}" class="profilepicture" alt="picture" width="50px" height="50px">`;
  }
  profileBody.innerHTML = `
    ${imgString}
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
  let profilePic = document.querySelector(".profilepicture");
  if (profilePic) {
    profilePic.addEventListener("click", async function () {
      let tag = prompt("Введіть свій тег гравця, наприклад, #L1O4R8E8M")
      if (tag) {
        let bsResponse = await impHttp.getBrawlStarsData(tag);
        if (bsResponse.status == 200) {
          await impHttp.setUserParam("profilePictureURL", `https://cdn.brawlify.com/profile/${bsResponse.data.icon.id}.png?v=1`)
          location.reload()
        }
      }
    });
  }


  let resultsBlock = document.querySelector(".user-results");

  if (!resultsBlock) {
    return;
  }
  resultsBlock.innerHTML = "";

  let userTestsResponse = await impHttp.getUserAnswers(profileInfo.id);
  if (userTestsResponse.status == 200) {
    let userTestsInfo = userTestsResponse.data;
    console.log(userTestsInfo);
    let testsIds = [];
    userTestsInfo.forEach((test) => {
      testsIds.push(test.testId);
    });
    testsIds = [...new Set(testsIds)];

    let allTestsResponse = await impHttp.getAllTestsFromDB(testsIds);
    if (allTestsResponse.status != 200) {
      return alert("Неможливо отримати тест");
    }
    testsInfo = allTestsResponse.data;

    if (profileInfo.roles.includes("ADMIN")) {
      impCreateAnswers.createUserBlockAdm(
        resultsBlock,
        testsInfo,
        userTestsInfo
      );
    } else {
      impCreateAnswers.createUserBlock(resultsBlock, testsInfo, userTestsInfo);
    }
  }
}
