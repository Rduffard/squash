function getEmailUsername(email) {
  if (typeof email !== "string" || !email.includes("@")) {
    return "User";
  }

  const [username] = email.split("@");
  return username || "User";
}

export function getUserDisplayName(user) {
  if (typeof user?.displayName === "string" && user.displayName.trim()) {
    return user.displayName.trim();
  }

  if (
    typeof user?.settings?.profileDisplayName === "string" &&
    user.settings.profileDisplayName.trim()
  ) {
    return user.settings.profileDisplayName.trim();
  }

  if (typeof user?.name === "string" && user.name.trim()) {
    return user.name.trim();
  }

  if (typeof user?.email === "string" && user.email.trim()) {
    return getEmailUsername(user.email);
  }

  return "User";
}
