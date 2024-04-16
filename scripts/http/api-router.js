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

export async function login(email, password) {
  try {
    let response = await $api.post(`/v1/user/login`, { email, password });
    if (response.status == 200 || response.statusText == "OK") {
      localStorage.setItem("token", response.data.accessToken);
    }
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function register(email, password, name) {
  try {
    let response = await $api.post(`/v1/user/register`, {
      email,
      password,
      name,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function isAuth() {
  try {
    let response = await $api.get(`/v1/user/checkAuth`);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getTests() {
  try {
    let response = await $api.get("/v1/test/get");
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getTestById(testId) {
  try {
    let response = await $api.get(`/v1/test/get/${testId}`);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getTestsById(testsArr) {
  try {
    let response = await $api.post(`/v1/test/get`, testsArr);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function finishTest(answers, username) {
  try {
    let response = await $api.post(`/v1/test/check`, {
      answers: answers,
      username: username,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getUserAnswers() {
  try {
    let response = await $api.get(`/v1/admin/useranswers`);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getStreams(countOfStreams) {
  console.log(countOfStreams);
  let params = { countOfStreams: countOfStreams };
  try {
    let response = await $api.post(`/v1/admin/youtubeStreams`, params);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getAllTestsFromDB() {
  console.log();

  try {
    let response = await $api.get(`/v1/test/getAllTestsFromDB`);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function deleteUserAnswer(answerId) {
  try {
    let response = await $api.post(`/v1/admin/delUserAnswer`, {
      answerId: answerId,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}
