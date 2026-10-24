
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function adminRequest(
  path: string,
  token: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || "Admin request failed"
    );
  }

  return data;
}

export const adminService = {
  getProducts: (token: string) =>
    adminRequest("/products", token),

  getOrders: (token: string) =>
    adminRequest("/admin/orders", token),

  addProduct: (token: string, formData: FormData) =>
    adminRequest("/product/add", token, {
      method: "POST",
      body: formData,
    }),

  updateProduct: (
    token: string,
    id: string,
    formData: FormData
  ) =>
    adminRequest(`/product/${id}`, token, {
      method: "PUT",
      body: formData,
    }),

  markOrderShipped: (token: string, id: string) =>
    adminRequest(`/order/status/${id}`, token, {
      method: "PUT",
    }),
};
