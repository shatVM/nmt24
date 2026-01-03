import * as importConfig from "../dev/config.js";
import * as impHttp from "../http/api-router.js";

const state = {
  users: [],
  selectedUserId: null,
};

const elements = {
  loginForm: document.querySelector(".admin-page__login"),
  list: document.querySelector(".admin-users__list"),
  searchInput: document.querySelector(".admin-users__search"),
  loadByIdInput: document.querySelector(".admin-users__id-input"),
  loadByIdButton: document.querySelector(".admin-users__load"),
  refreshButton: document.querySelector(".admin-users__refresh"),
  status: document.querySelector(".admin-users__status"),
  form: document.querySelector(".admin-users__form"),
  deleteButton: document.querySelector(".admin-users__delete"),
  fields: {
    id: document.querySelector(".admin-users__form [name='id']"),
    email: document.querySelector(".admin-users__form [name='email']"),
    name: document.querySelector(".admin-users__form [name='name']"),
    group: document.querySelector(".admin-users__form [name='group']"),
    subgroup: document.querySelector(".admin-users__form [name='subgroup']"),
    educationOrg: document.querySelector(".admin-users__form [name='educationOrg']"),
    roleAdmin: document.querySelector(".admin-users__form [name='roleAdmin']"),
    testLimit: document.querySelector(".admin-users__form [name='testLimit']"),
    profilePictureURL: document.querySelector(".admin-users__form [name='profilePictureURL']"),
    passedTestsNumber: document.querySelector(".admin-users__form [name='passedTestsNumber']"),
  },
};

adminLogin();

async function adminLogin() {
  if (!elements.loginForm) {
    return;
  }

  try {
    const authResponse = await impHttp.isAuth();
    if (authResponse.status === 200 && hasAdminAccess()) {
      elements.loginForm.remove();
      await adminPage();
    } else if (authResponse.status !== 200) {
      setupLoginForm(elements.loginForm);
    } else {
      redirectToHome("У вас немає прав адміністратора");
    }
  } catch (error) {
    console.error("Помилка автентифікації:", error);
    setupLoginForm(elements.loginForm);
  }
}

function hasAdminAccess() {
  return ["ADMIN", "TEACHER"].some((role) =>
    window?.userInfo?.roles?.includes(role)
  );
}

function redirectToHome(message) {
  location.href = importConfig.client_url;
  alert(message);
}

function setupLoginForm(loginForm) {
  const button = loginForm.querySelector(".admin-page__login-submit");
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.querySelector(".admin-page-email").value;
    const password = document.querySelector(".admin-page-password").value;
    const loginResponse = await impHttp.login(email, password);
    if (loginResponse.status === 200) {
      loginForm.remove();
      await adminPage();
    }
  });
}

async function adminPage() {
  bindEvents();
  await loadUsers();
  const initialUserId = getUserIdFromQuery();
  if (initialUserId) {
    await selectUser(initialUserId, true);
  }
}

function bindEvents() {
  elements.searchInput?.addEventListener("input", () => {
    renderUsersList(filterUsers());
  });

  elements.refreshButton?.addEventListener("click", async () => {
    await loadUsers();
  });

  elements.loadByIdButton?.addEventListener("click", async () => {
    const userId = elements.loadByIdInput?.value?.trim() || "";
    if (!userId) {
      setStatus("Вкажіть ID користувача.", "error");
      return;
    }
    await selectUser(userId, true);
  });

  elements.form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedUserId) {
      setStatus("Оберіть користувача зі списку.", "error");
      return;
    }
    await updateUser(state.selectedUserId);
  });

  elements.deleteButton?.addEventListener("click", async () => {
    if (!state.selectedUserId) {
      setStatus("Оберіть користувача зі списку.", "error");
      return;
    }
    if (!confirm("Видалити користувача?")) {
      return;
    }
    await deleteUser(state.selectedUserId);
  });
}

async function loadUsers() {
  setStatus("Завантаження користувачів...");
  const response = await impHttp.getAllUsers();
  if (response.status !== 200) {
    setStatus("Не вдалося отримати список користувачів.", "error");
    return;
  }
  state.users = response.data
    .map(normalizeUser)
    .filter((user) => user.id);
  renderUsersList(filterUsers());
  setStatus(`Користувачів: ${state.users.length}.`, "success");
}

function renderUsersList(users) {
  if (!elements.list) {
    return;
  }
  elements.list.innerHTML = "";
  if (!users.length) {
    const empty = document.createElement("div");
    empty.textContent = "Нічого не знайдено.";
    elements.list.appendChild(empty);
    return;
  }

  users.forEach((user) => {
    const item = document.createElement("div");
    item.className = "admin-users__item";
    if (user.id === state.selectedUserId) {
      item.classList.add("is-active");
    }
    const title = document.createElement("div");
    title.className = "admin-users__item-title";
    title.textContent = user.name || "Без імені";
    const subtitle = document.createElement("div");
    subtitle.className = "admin-users__item-subtitle";
    subtitle.textContent = `${user.email || "Без email"} • ${user.group || "Без групи"}`;
    const idLine = document.createElement("div");
    idLine.className = "admin-users__item-subtitle";
    idLine.textContent = user.id;
    item.appendChild(title);
    item.appendChild(subtitle);
    item.appendChild(idLine);
    item.addEventListener("click", async () => {
      await selectUser(user.id, true);
    });
    elements.list.appendChild(item);
  });
}

function filterUsers() {
  const term = elements.searchInput?.value?.trim().toLowerCase() || "";
  if (!term) {
    return [...state.users].sort(sortByName);
  }
  return state.users
    .filter((user) =>
      [user.name, user.email, user.group, user.subgroup, user.id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    )
    .sort(sortByName);
}

function sortByName(a, b) {
  return (a.name || "").localeCompare(b.name || "", "uk");
}

async function selectUser(userId, fetchFresh) {
  if (!userId) {
    return;
  }
  state.selectedUserId = userId;
  setUserIdQuery(userId);
  let selectedUser = state.users.find((user) => user.id === userId);

  if (fetchFresh) {
    const response = await impHttp.getAdminUserById(userId);
    if (response.status === 200) {
      selectedUser = normalizeUser(response.data);
      upsertUser(selectedUser);
    } else {
      setStatus("Не вдалося отримати дані користувача.", "error");
    }
  }

  if (!selectedUser) {
    setStatus("Користувача не знайдено.", "error");
    return;
  }

  fillForm(selectedUser);
  if (elements.loadByIdInput) {
    elements.loadByIdInput.value = userId;
  }
  renderUsersList(filterUsers());
}

function fillForm(user) {
  elements.fields.id.value = user.id || "";
  elements.fields.email.value = user.email || "";
  elements.fields.name.value = user.name || "";
  elements.fields.group.value = user.group || "";
  elements.fields.subgroup.value = user.subgroup || "";
  elements.fields.educationOrg.value = user.educationOrg || "";
  if (elements.fields.roleAdmin) {
    elements.fields.roleAdmin.checked = Array.isArray(user.roles)
      ? user.roles.includes("ADMIN")
      : false;
  }
  elements.fields.testLimit.value =
    typeof user.testLimit === "number" ? user.testLimit : "";
  elements.fields.profilePictureURL.value = user.profilePictureURL || "";
  elements.fields.passedTestsNumber.value = user.passedTestsNumber || 0;
}

async function updateUser(userId) {
  const payload = buildUpdatePayload();
  if (Object.keys(payload).length === 0) {
    setStatus("Немає змін для оновлення.", "error");
    return;
  }

  const response = await impHttp.updateAdminUser(userId, payload);
  if (response.status !== 200) {
    setStatus("Не вдалося оновити користувача.", "error");
    return;
  }
  const updatedUser = normalizeUser(response.data);
  upsertUser(updatedUser);
  fillForm(updatedUser);
  setStatus("Дані користувача оновлено.", "success");
  alert("Користувача успішно оновлено.");
  renderUsersList(filterUsers());
}

async function deleteUser(userId) {
  const response = await impHttp.deleteAdminUser(userId);
  if (response.status !== 200) {
    setStatus("Не вдалося видалити користувача.", "error");
    return;
  }
  state.users = state.users.filter((user) => user.id !== userId);
  state.selectedUserId = null;
  clearForm();
  setUserIdQuery(null);
  renderUsersList(filterUsers());
  setStatus("Користувача видалено.", "success");
}

function buildUpdatePayload() {
  const payload = {
    name: elements.fields.name.value.trim(),
    group: elements.fields.group.value.trim(),
    subgroup: elements.fields.subgroup.value.trim(),
    educationOrg: elements.fields.educationOrg.value.trim(),
    profilePictureURL: elements.fields.profilePictureURL.value.trim(),
  };

  const roles = ["USER"];
  if (elements.fields.roleAdmin?.checked) {
    roles.push("ADMIN");
  }
  payload.roles = roles;

  const testLimitValue = elements.fields.testLimit.value.trim();
  if (testLimitValue !== "") {
    const parsedLimit = Number(testLimitValue);
    if (!Number.isNaN(parsedLimit)) {
      payload.testLimit = parsedLimit;
    }
  }

  return payload;
}

function normalizeUser(user) {
  return {
    id: user.id || user._id || user.userId || "",
    name: user.name || "",
    email: user.email || "",
    group: user.group || "",
    subgroup: user.subgroup || "",
    educationOrg: user.educationOrg || "",
    passedTests: Array.isArray(user.passedTests) ? user.passedTests : [],
    passedTestsNumber:
      typeof user.passedTestsNumber === "number"
        ? user.passedTestsNumber
        : Array.isArray(user.passedTests)
        ? user.passedTests.length
        : 0,
    roles: Array.isArray(user.roles) ? user.roles : [],
    testLimit:
      typeof user.testLimit === "number"
        ? user.testLimit
        : user.testLimit
        ? Number(user.testLimit)
        : null,
    profilePictureURL: user.profilePictureURL || "",
  };
}

function upsertUser(user) {
  const index = state.users.findIndex((item) => item.id === user.id);
  if (index >= 0) {
    state.users[index] = user;
  } else {
    state.users.push(user);
  }
}

function clearForm() {
  Object.values(elements.fields).forEach((field) => {
    if (field) {
      field.value = "";
    }
  });
}

function setStatus(message, type) {
  if (!elements.status) {
    return;
  }
  elements.status.textContent = message || "";
  elements.status.classList.remove("is-error", "is-success");
  if (type === "error") {
    elements.status.classList.add("is-error");
  }
  if (type === "success") {
    elements.status.classList.add("is-success");
  }
}

function getUserIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

function setUserIdQuery(userId) {
  const url = new URL(window.location.href);
  if (userId) {
    url.searchParams.set("userId", userId);
  } else {
    url.searchParams.delete("userId");
  }
  history.replaceState(null, "", url.toString());
}
