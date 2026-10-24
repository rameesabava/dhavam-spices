
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type RegisterPayload = {
  username: string;
  email: string;
  phone: string;
  password: string;
};

export async function register(payload: RegisterPayload) {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data || "Registration failed"
    );
  }

  return data;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || "Login failed."
    );
  }

  if (!data?.token) {
    throw new Error("Login succeeded, but no token was returned.");
  }

  localStorage.setItem("token", data.token);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}
