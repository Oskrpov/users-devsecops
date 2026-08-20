const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:3000";

const elements = {
  tableBody: document.querySelector("#usersTableBody"),
  emptyState: document.querySelector("#emptyState"),
  loading: document.querySelector("#loading"),
  message: document.querySelector("#message"),
  search: document.querySelector("#searchInput"),
  newUser: document.querySelector("#newUserButton"),
  dialog: document.querySelector("#userDialog"),
  form: document.querySelector("#userForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  userId: document.querySelector("#userId"),
  firstName: document.querySelector("#firstName"),
  lastName: document.querySelector("#lastName"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  formError: document.querySelector("#formError"),
  cancel: document.querySelector("#cancelButton"),
  close: document.querySelector("#closeDialogButton"),
  version: document.querySelector("#versionBadge")
};

let users = [];

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await Promise.all([loadUsers(), loadVersion()]);
});

function bindEvents() {
  elements.newUser.addEventListener("click", () => openDialog());
  elements.cancel.addEventListener("click", closeDialog);
  elements.close.addEventListener("click", closeDialog);
  elements.form.addEventListener("submit", handleSubmit);
  elements.search.addEventListener("input", renderUsers);
  elements.tableBody.addEventListener("click", handleTableAction);
}

async function loadUsers() {
  setLoading(true);
  try {
    const response = await request("/api/users");
    users = response.data;
    renderUsers();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    setLoading(false);
  }
}

async function loadVersion() {
  try {
    const response = await request("/version");
    elements.version.textContent = `v${response.version}`;
  } catch {
    elements.version.textContent = "version unavailable";
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  clearFormError();

  const payload = {
    first_name: elements.firstName.value.trim(),
    last_name: elements.lastName.value.trim(),
    email: elements.email.value.trim(),
    phone: elements.phone.value.trim() || null
  };

  const id = elements.userId.value;
  const method = id ? "PUT" : "POST";
  const path = id ? `/api/users/${id}` : "/api/users";

  try {
    await request(path, { method, body: JSON.stringify(payload) });
    closeDialog();
    await loadUsers();
    showMessage(id ? "User updated successfully." : "User created successfully.");
  } catch (error) {
    showFormError(error.message);
  }
}

async function handleTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const user = users.find((item) => item.id === id);

  if (action === "edit" && user) openDialog(user);

  if (action === "delete") {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    try {
      await request(`/api/users/${id}`, { method: "DELETE" });
      await loadUsers();
      showMessage("User deleted successfully.");
    } catch (error) {
      showMessage(error.message, true);
    }
  }
}

function renderUsers() {
  const query = elements.search.value.trim().toLowerCase();
  const filtered = users.filter((user) =>
    [user.first_name, user.last_name, user.email, user.phone]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query))
  );

  elements.tableBody.innerHTML = filtered.map((user) => `
    <tr>
      <td>${escapeHtml(`${user.first_name} ${user.last_name}`)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.phone || "—")}</td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <div class="actions">
          <button class="action-button edit" data-action="edit" data-id="${user.id}">Edit</button>
          <button class="action-button delete" data-action="delete" data-id="${user.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  elements.emptyState.classList.toggle("hidden", filtered.length !== 0);
}

function openDialog(user = null) {
  elements.form.reset();
  clearFormError();
  elements.userId.value = user?.id || "";
  elements.dialogTitle.textContent = user ? "Edit user" : "New user";
  elements.firstName.value = user?.first_name || "";
  elements.lastName.value = user?.last_name || "";
  elements.email.value = user?.email || "";
  elements.phone.value = user?.phone || "";
  elements.dialog.showModal();
  elements.firstName.focus();
}

function closeDialog() {
  elements.dialog.close();
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(body?.error?.message || "Request failed.");
  }

  return body;
}

function setLoading(value) {
  elements.loading.classList.toggle("hidden", !value);
}

function showMessage(message, error = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle("error", error);
  elements.message.classList.remove("hidden");
  window.setTimeout(() => elements.message.classList.add("hidden"), 3500);
}

function showFormError(message) {
  elements.formError.textContent = message;
  elements.formError.classList.remove("hidden");
}

function clearFormError() {
  elements.formError.textContent = "";
  elements.formError.classList.add("hidden");
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
