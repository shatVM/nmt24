import * as importConfig from "../dev/config.js";
import * as impAdminCtrls from "../admin/adminControlls.js";

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
      let userData = response.data;
      window.name = userData.user.name;
      window.group = userData.user.group;
      window.userInfo = userData.user;
      window.userId = userData.user.id;
      if (response?.data?.user?.roles?.includes("ADMIN")) {
        impAdminCtrls.createAdminHeader();
      }
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
    console.log(response)
    if (response?.data?.roles?.includes("ADMIN")) {
      impAdminCtrls.createAdminHeader();
    }
    let userData = response.data;
    window.name = userData.name;
    window.group = userData.group;
    window.userInfo = userData;
    window.userId = userData.id;

    return await response;
  } catch (error) {
    console.log(error);
    console.log(error.response?.data?.message);
    return error;
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

export async function finishTest(answers, username, clientId) {
  try {
    let response = await $api.post(`/v1/test/check`, {
      answers: answers,
      username: username,
      clientId: clientId,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getUserAnswers(userId) {
  try {
    let response = await $api.get(`/v1/admin/useranswers/${userId}`);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function getAllUserAnswers() {
  try {
    let response = await $api.get(`/v1/admin/allUserAnswers`);
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

export async function getAllTestsFromDB(testIds = null) {
  try {
    if (!testIds) {
      let response = await $api.get(`/v1/test/getAllTestsFromDB`);
      return response;
    } else {
      let response = await $api.post(`/v1/test/getAllTestsFromDB`, {
        testIds: testIds,
      });
      return response;
    }
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

export async function changeDBParam(testId, param, value) {
  try {
    let response = await $api.post(`/v1/test/changeParam`, {
      testId: testId,
      param: param,
      value: value,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function setDocumentParam(testId, param, value) {
  try {
    let params = new URLSearchParams({
      documentId: testId,
    }).toString();

    let response = await $api.put(`/v1/test/documentParam?${params}`, {
      param: param,
      value: value,
    });
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}
