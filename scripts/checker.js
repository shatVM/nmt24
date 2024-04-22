import * as importConfig from "./dev/config.js";

let username = localStorage.getItem("username");
let usergroup = localStorage.getItem("usergroup");
let isTestPlaying = localStorage.getItem("isTestPlaying");
let testPlayingId = localStorage.getItem("testPlayingId");

if (location.href.includes("#admin/useranswers")) {
  location = importConfig.client_url + "/adminPage.html";
}

if (
  JSON.parse(isTestPlaying) == true &&
  testPlayingId &&
  !location.href.includes("testPage")
) {
  location = importConfig.client_url + "/testPage.html";
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      console.log("Коричтувач вийшов з сайту");
    } else {
      console.log("Коричтувач повернувся на сайт");
    }
  });

  // document.addEventListener("screenshotTaken", function (event) {
  //   let html = document.querySelector("html");
  //   if (!html) {
  //     html.innerHTML = "";
  //   }
  // });
});
