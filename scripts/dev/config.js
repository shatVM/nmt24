let admMode = 0;
// 1 - автоматично вибирати 2 перших чекбокса
// 0 - автоматично НЕ вибирати чекбокси

//Показувати кнопку завершення тестування  
let showTestFinishButton = 1;

//Показувати блок запитання в профілі 
let showQuestionInProfile = 1;

//Показувати відповіді учня в профілі
let showUserAnswersInProfile = 1;

//Показувати правильні результати в профілі
let showCorrectAnswersInProfile = 0;

// Кількість iframe на youtube.html
let countOfStreams = 0;

let client;
let api;
let ws_api;

let status = 10; //client = "https://shatvm.github.io/nmt24" 
                 //api = "https://services.lyceum.ztu.edu.ua/nmt24/rest

// let status = 11; //11 для локального тестування

switch (status) {
  // 1 - dev 127.0.0.1
  case 1:
    client = "http://127.0.0.1:5500/client";
    api = "http://localhost:5050/rest";
    ws_api = "ws://localhost:5060/";
    break;
  // 2 - render
  case 2:
    client = "https://shatvm.github.io/nmt24";
    api = "http://10.14.33.5:5050/rest";

    //api = "https://nmt-server-i40l.onrender.com/rest";
    ws_api = "wss:/nmt-server-i40l.onrender.com:5060/";
    break;
  // 3 - host 3003
  case 3:
    client = "http://10.14.33.5:5050/nmt24/nmt-client";
    api = "http://10.14.33.5:5050/rest";
    ws_api = "ws://localhost:5060/";
    break;
  // 4 - host 10.15.131.218
  case 4:
    client = "https://10.15.131.218/nmt24/nmt-client";
    api = "https://10.15.131.218/rest";
    ws_api = "wss://localhost:5060/";
    break;
  // 5 - dev спеціально для Live Server в Sublime Text
  case 5:
    client = "http://localhost:5500";
    api = "http://localhost:8080/rest";
    ws_api = "wss://localhost:5060/";
    break;
  // 6 - turbo-telegram-vwxx54w6vxqhx9rq-5500.app.github.dev
  case 6:
    client = "https://turbo-telegram-vwxx54w6vxqhx9rq-5500.app.github.dev";
    api = "https://nmt-server.onrender.com/rest";
    ws_api = "wss://nmt-server.onrender.com/";
    break;
  // 10 - docker контейнер на серваку політеха
  case 10:
    client = "https://shatvm.github.io/nmt24";
    api = "https://services.lyceum.ztu.edu.ua/nmt24/rest";
    ws_api = "";
    break;
  // 11 - клієнт на локалці, сервер docker контейнер на серваку політеха
  case 11:
    client = "http://localhost:5500";
    api = "https://services.lyceum.ztu.edu.ua/nmt24/rest";
    ws_api = "";
    break;

  case 12:
    client = "http://10.14.33.5/nmt24/nmt-client";
    api = "https://services.lyceum.ztu.edu.ua/nmt24/rest";
    ws_api = "";
    break;

  case 13:
    client = "http://10.15.137.144:7777";
    api = "https://services.lyceum.ztu.edu.ua/nmt24/rest";
    ws_api = "";
    break;
}



export let client_url = client;
export let api_url = api;
export let ws_api_url = ws_api;
export let showFinishButton = showTestFinishButton;
export let countStreams = countOfStreams;
export let adminMode = admMode;
export let showCorrectAnswers = showCorrectAnswersInProfile;
export let showUserAnswers = showUserAnswersInProfile;
export let showQuestion = showQuestionInProfile;
