import * as importConfig from "./dev/config.js";

let username = localStorage.getItem("username");
let usergroup = localStorage.getItem("usergroup");
let isTestPlaying = localStorage.getItem("isTestPlaying");
let testPlayingId = localStorage.getItem("testPlayingId");

if (
  JSON.parse(isTestPlaying) == true &&
  testPlayingId &&
  !location.href.includes("testPage")
) {
  location = importConfig.client_url + "/testPage.html";
}

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    console.log("Коричтувач вийшов з сайту");
  } else {
    console.log("Коричтувач повернувся на сайт");
  }
});
