const API_BASE_URL = "https://starhub-backend.onrender.com";

// === REGISTER ===
export async function registerUser(email, password) {
  const response = await fetch(API_BASE_URL + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
}

// === LOGIN ===
export async function loginUser(email, password) {
  const response = await fetch(API_BASE_URL + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
}

// === PROFILE ===
export async function getProfile(token) {
  const response = await fetch(API_BASE_URL + "/api/profile", {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch profile");
  }
  return data;
}