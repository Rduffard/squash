const GH_BASE = "https://api.github.com";

async function ghRequest(path, { method = "GET" } = {}) {
  const res = await fetch(`${GH_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
    },
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
      data?.message || `GitHub request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

/**
 * Safely split "owner/repo" into path-safe segments
 */
function splitRepoFullName(repoFullName) {
  const safe = String(repoFullName || "").trim();

  if (!/^[^/]+\/[^/]+$/.test(safe)) {
    throw new Error("repoFullName must be like 'owner/repo'");
  }

  const [owner, repo] = safe.split("/");
  return {
    owner: encodeURIComponent(owner),
    repo: encodeURIComponent(repo),
  };
}

export function getRepo(repoFullName) {
  const { owner, repo } = splitRepoFullName(repoFullName);
  return ghRequest(`/repos/${owner}/${repo}`);
}

export async function getRepoIssues(
  repoFullName,
  { state = "open", perPage = 10 } = {},
) {
  const { owner, repo } = splitRepoFullName(repoFullName);

  const qs = new URLSearchParams({
    state,
    per_page: String(perPage),
  }).toString();

  const items = await ghRequest(`/repos/${owner}/${repo}/issues?${qs}`);
  return Array.isArray(items) ? items.filter((i) => !i.pull_request) : [];
}
