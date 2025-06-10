const API_BASE_URL = "https://starhub-backend.onrender.com/api";

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
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

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
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

export async function getProfile(token) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch profile");
  }
  return data;
}