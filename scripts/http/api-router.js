import * as importConfig from "../dev/config.js";

const API_URL = importConfig.api_url;

const $api = axios.create({
  withCredentials: false,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
    }
    throw error;
  }
);

export async function registration(username, email, password) {
  let loginData = {
    username: username,
    email: email,
    password: password,
  };
  try {
    let response = await $api.post("/registration", loginData);
    if (response.status == 200 || response.statusText == "OK") {
      localStorage.setItem("token", response.data.accessToken);
    }
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error;
  }
}
export async function getTests() {
  try {
    let response = await $api.get("/v1/test/get");
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error;
  }
}

export async function getTestById(testId) {
  try {
    let response = await $api.get(`/v1/test/get/${testId}`);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error;
  }
}

export async function getTestsById(testsArr) {
  try {
    let response = await $api.post(`/v1/test/get`, testsArr);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error;
  }
}

export async function finishTest(answers) {
  try {
    let response = await $api.post(`/v1/test/check`, {
      answers: answers,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error;
  }
}
