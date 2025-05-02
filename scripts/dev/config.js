let admMode = 0;
// 1 - автоматично вибирати 2 перших чекбокса
// 0 - автоматично НЕ вибирати чекбокси

//Показувати кнопку завершення тестування  
let showTestFinishButton = 1;

let status = 4;

let client;
let api;
let ws_api;

//let status = 10;

let countOfStreams = 0;

//Показувати правильні результати в профілі
let showCorrectAnswersInProfile = 1;

if (status == 1) {
  client = "http://127.0.0.1:5500/client";
  api = "http://localhost:5050/rest";
  ws_api = "ws://localhost:5060/";
} else if (status == 2) {
  client = "https://shatvm.github.io/nmt24";
  api = "https://nmt-server.onrender.com/rest";
  ws_api = "wss://localhost:5060/";
} else if (status == 3) {
  client = "http://10.14.33.5/nmt24/nmt-client";
  api = "http://10.14.33.5:5050/rest";
  ws_api = "ws://localhost:5060/";
} else if (status == 4) {
  client = "http://10.15.131.218/nmt24/nmt-client";
  api = "http://10.15.131.218/rest";
  ws_api = "wss://localhost:5060/";
} else if (status == 5) {
  client = "http://localhost:5500";
  api = "http://localhost:5050/rest";
  ws_api = "wss://localhost:5060/";
} else if (status == 6) {
  client = "https://turbo-telegram-vwxx54w6vxqhx9rq-5500.app.github.dev";
  api = "https://nmt-server.onrender.com/rest";
  ws_api = "wss://nmt-server.onrender.com/";
}


export let client_url = client;
export let api_url = api;
export let ws_api_url = ws_api;
export let showFinishButton = showTestFinishButton;
export let countStreams = countOfStreams;
export let adminMode = admMode;
export let showCorrectAnswers = showCorrectAnswersInProfile;
export let showUserAnswers= showUserAnswersInProfile;
export let showQuestion = showQuestionInProfile;
