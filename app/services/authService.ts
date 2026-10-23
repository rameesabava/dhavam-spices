
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type RegisterPayload = {
  username: string;
  email: string;
  phone: string;
  password: string;
};

export async function register(payload: RegisterPayload) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Registration failed");
  }

  return data;
}


export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    throw new Error(data?.message || "Login failed.");
  }

  return data;
}

