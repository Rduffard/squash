// src/utils/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function getToken() {
  const raw = localStorage.getItem("cw_auth");
  if (!raw) return null;

  try {
    return JSON.parse(raw)?.token;
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                                   PROJECTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * GET /squash/projects
 * Returns projects current user can access
 */
export function getProjects() {
  return request("/squash/projects");
}

/**
 * GET /squash/projects/:projectId
 */
export function getProjectById(projectId) {
  return request(`/squash/projects/${encodeURIComponent(projectId)}`);
}

/**
 * POST /squash/projects
 */
export function createProject(payload) {
  return request("/squash/projects", {
    method: "POST",
    body: payload,
  });
}

/**
 * PATCH /squash/projects/:projectId
 * (Use PATCH to support partial updates)
 */
export function updateProject(projectId, payload) {
  return request(`/squash/projects/${encodeURIComponent(projectId)}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * DELETE /squash/projects/:projectId
 */
export function deleteProject(projectId) {
  return request(`/squash/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
  });
}

/* -------------------------------------------------------------------------- */
/*                                     BUGS                                   */
/* -------------------------------------------------------------------------- */

/**
 * GET /squash/bugs
 * Optionally: GET /squash/bugs?projectId=...
 */
export function getBugs({ projectId } = {}) {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  return request(`/squash/bugs${qs}`);
}

/**
 * GET /squash/bugs/:bugId
 */
export function getBugById(bugId) {
  return request(`/squash/bugs/${encodeURIComponent(bugId)}`);
}

/**
 * POST /squash/bugs
 */
export function createBug(payload) {
  return request("/squash/bugs", {
    method: "POST",
    body: payload,
  });
}

/**
 * PATCH /squash/bugs/:bugId
 */
export function updateBug(bugId, payload) {
  return request(`/squash/bugs/${encodeURIComponent(bugId)}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * DELETE /squash/bugs/:bugId
 */
export function deleteBug(bugId) {
  return request(`/squash/bugs/${encodeURIComponent(bugId)}`, {
    method: "DELETE",
  });
}

/* -------------------------------------------------------------------------- */
/*                              SHARED SETTINGS                               */
/* -------------------------------------------------------------------------- */

export function getUserSettings() {
  return request("/auth/users/me/settings");
}

export function updateUserSettings(settings) {
  return request("/auth/users/me/settings", {
    method: "PATCH",
    body: settings,
  });
}
