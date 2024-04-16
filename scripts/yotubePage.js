import * as impHttp from "./http/api-router.js";
import * as importConfig from "./dev/config.js";


// Масив посилань на відео
const videoLinks = await impHttp.getStreams(importConfig.countStreams);


// Отримання елементу .main-page
const mainPage = document.querySelector('.main-page');

// Очистка вмісту .main-page
mainPage.innerHTML = '';

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