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
  console.log(profileInfo);
  let imgString = "";
  if (profileInfo.profilePictureURL != "") {
    imgString = `<img src="${profileInfo.profilePictureURL}" class="profilepicture" alt="picture" width="50px" height="50px">`;
  }
  profileBody.innerHTML = `
<div class="profile-content-wrapper">
    <div class="profile-details">
      ${imgString}
      <div class="profile-text-details">
        <h2 class="profile-info-title profile-info__name">
        ${profileInfo.name}
        </h2>
        <p class="profile-info-text profile-info__email">
        <strong>Email:</strong> ${profileInfo.email}
        </p>
        <p class="profile-info-text profile-info__educationOrg">
        <strong>Заклад освіти:</strong> ${profileInfo.educationOrg}
        </p>
      
        <p class="profile-info-text profile-info__roles">
        <strong>Ролі:</strong> ${profileInfo.roles.join(", ")}
        </p>
        <p class="profile-info-text profile-info__group"><strong>Група:</strong> ${profileInfo.group}</p>
        <p class="profile-info-text profile-info__passedTests">
        <strong>Пройдено тестів:</strong><span class="profile-info__passedTestsNumber"></span>
        </p>
        <div class="profile-info__buttons">
        <button class="profile-info-button hide-button">
            Згорнути профіль
          </button>
          <button class="profile-info-button logout-button">
            Вийти з аккаунту
          </button>
        </div>
      </div>
    </div>
    <div class="profile-progress">
        <h2 class="profile-info-title">Прогрес</h2>
        <div class="progress-bars-container">
            <p>Дані про прогрес завантажуються...</p>
        </div>
    </div>
   
</div>
   <!--<p class="profile-info-text profile-info__testLimit">
    Залишилось спроб: ${profileInfo.testLimit}
    </p> -->   
                         
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
    //console.log(userTestsInfo);
    let testsIds = [];
    userTestsInfo.forEach((test) => {
      testsIds.push(test.testId);
    });
    testsIds = [...new Set(testsIds)];
    console.log(testsIds);
    document.getElementsByClassName("profile-info__passedTestsNumber")[0].innerText = `${userTestsInfo.length}`;
    //console.log(document.getElementsByClassName("profile-info__passedTestsNumber")[0]);
    //let passedTestsNumber = ocument.getElementbyClassName(".profile-info__passedTestsNumber")

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

  // Тут буде логіка для прогрес барів
  const progressContainer = document.querySelector('.progress-bars-container');
  if (progressContainer) {
      const resultItems = document.querySelectorAll('.user-results .result-item');
      let testsProgress = [];

      resultItems.forEach(item => {
          const titleElement = item.querySelector('.result-item__title');
          const scoreElement = item.querySelector('.result-item__score');
          
          if (titleElement && scoreElement) {
              const testTitle = titleElement.innerText.trim();
              const userScoreEl = scoreElement.querySelector('.user-score b');
              const generalScoreEl = scoreElement.querySelector('.general-score b');

              if (userScoreEl && generalScoreEl) {
                const userScore = userScoreEl.innerText;
                const generalScore = generalScoreEl.innerText;
                
                testsProgress.push({
                    test: testTitle,
                    correct: parseInt(userScore),
                    total: parseInt(generalScore)
                });
              }
          }
      });

      progressContainer.innerHTML = createProgressBars(testsProgress);
  }
}

function createProgressBars(testsProgress) {
  if (!testsProgress || testsProgress.length === 0) {
    return '<p>Немає даних про прогрес.</p>';
  }

  return testsProgress.map(testData => {
    const percentage = (testData.correct / testData.total) * 100;
    return `
      <div class="subject-progress">
        <div class="subject-progress-info">
            <span class="subject-name">${testData.test}</span>
            <span class="subject-stats">${testData.correct} з ${testData.total}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentage}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}
