let status = 1;
// 1 -dev
// 2 render
// 3 - host
let client;
let api;

if (status == 1) {
  client = "http://127.0.0.1:5500/client/";
  api = "http://localhost:5050/rest";
} else if (status == 2) {
  client = "https://shatvm.github.io/nmt24";
  api = "https://nmt-server.onrender.com/rest";
} else if (status == 3) {
  client = "http://localhost/nmt24/nmt-client";
  api = "https://nmt-server.onrender.com/rest";
}

export let client_url = client;
export let api_url = api;
