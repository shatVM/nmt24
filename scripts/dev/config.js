let admMode = 0;
// 1 - автоматично вибирати 2 перших чекбокса
// 0 - автоматично НЕ вибирати чекбокси

let showTestFinishButton = 1;

let status = 10;
// 1 - dev 127.0.0.1
// 2 - render
// 3 - host 3003
// 4 - host 10.15.131.218
// 5 - dev спеціально для Live Server в Sublime Text
// 6 - для Chromebook
// 7 - dev-validator.ztu.edu.ua
// 10 - docker контейнер на серваку політеха

let client;
let api;
let ws_api;

// Кількість iframe на youtube.html

let countOfStreams = 3;

//Показувати правильні результати в профілі
let showCorrectAnswersInProfile = 1;

if (status == 1) {
  client = "http://127.0.0.1:5500/client";
  api = "http://localhost:5050/rest";
  ws_api = "ws://localhost:5060/";
} else if (status == 2) {
  client = "https://shatvm.github.io/nmt24";
  api = "https://nmt-server-o801.onrender.com/rest";
  ws_api = "wss:/nmt-server-o801.onrender.comt:5060/";
} else if (status == 3) {
  client = "http://10.14.33.5/nmt24/nmt-client";
  api = "http://10.14.33.5:5050/rest";
  ws_api = "ws://localhost:5060/";
} else if (status == 4) {
  client = "https://10.15.131.218/nmt24/nmt-client";
  api = "https://10.15.131.218/rest";
  ws_api = "wss://localhost:5060/";
} else if (status == 5) {
  client = "http://localhost:5500";
  api = "http://localhost:5050/rest";
  ws_api = "wss://localhost:5060/";
} else if (status == 6) {
  client = "https://turbo-telegram-vwxx54w6vxqhx9rq-5500.app.github.dev";
  api = "https://nmt-server.onrender.com/rest";
  ws_api = "wss://nmt-server.onrender.com/";
}else if (status == 10) {
  client = "https://shatvm.github.io/nmt24";
  api = "https://services.lyceum.ztu.edu.ua/nmt24/rest";
  ws_api = "wss:/nmt-server-o801.onrender.comt:5060/";
}

export let client_url = client;
export let api_url = api;
export let ws_api_url = ws_api;
export let showFinishButton = showTestFinishButton;
export let countStreams = countOfStreams;
export let adminMode = admMode;
export let showCorrectAnswers = showCorrectAnswersInProfile;
