let admMode = 0;
// 1 - автоматично вибирати 2 перших чекбокса
// 0 - автоматично НЕ вибирати чекбокси

let showTestFinishButton = 1;
let status = 1;

// 1 - dev
// 2 - render
// 3 - host 3003
// 4 - host ztu.edu.ua
// 5 - dev спеціально для Live Server в Sublime Text

let client;
let api;

// Кількість iframe на youtube.html
let countOfStreams = 0;

if (status == 1) {
  client = "http://127.0.0.1:5500/client";
  api = "http://localhost:5050/rest";
} else if (status == 2) {
  client = "https://shatvm.github.io/nmt24";
  api = "https://nmt-server.onrender.com/rest";
} else if (status == 3) {
  client = "http://10.14.33.5/nmt24/nmt-client";
  api = "http://10.14.33.5:5050/rest";
} else if (status == 4) {
  client = "https://10.15.131.218/nmt24/nmt-client";
  api = "https://10.15.131.218/rest";
} else if (status == 5) {
  client = "http://127.0.0.1:5500";
  api = "http://localhost:5050/rest";
}

export let client_url = client;
export let api_url = api;
export let showFinishButton = showTestFinishButton;
export let countStreams = countOfStreams;
export let adminMode = admMode;
