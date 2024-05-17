import * as impHttp from "./http/api-router.js";
import * as importConfig from "./dev/config.js";

impHttp.isAuth()

// Отримання елементу .main-page
const mainPage = document.querySelector('.main-page');


if (importConfig.countStreams == 0){
    const h1 = document.createElement('h1');
    h1.innerHTML = "Наразі немає прямих трансляцій НМТ 😥"
    mainPage.appendChild(h1)
} else {
    // Масив посилань на відео
const videoLinks = await impHttp.getStreams(importConfig.countStreams);

// Очистка вмісту .main-page
mainPage.innerHTML = '';
console.log(videoLinks, videoLinks.data)
if (videoLinks == undefined || videoLinks.length == 0){
    console.log("none")
} else {
// Додавання посилань на відео з масиву videoLinks
    videoLinks.data.forEach(link => {
        const iframe = document.createElement('iframe');
        iframe.width = '600';
        iframe.height = '337';
        iframe.src = "https://www.youtube.com/embed/" + link;
        iframe.title = 'YouTube video player';
        iframe.frameborder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerpolicy = 'strict-origin-when-cross-origin';
        iframe.allowfullscreen = true;
        mainPage.appendChild(iframe);
    });
    }
}