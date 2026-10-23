
import { apiRequest } from "./api";

export function getProducts(token: string) {
  return apiRequest("/products", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getProductById(
  id: string,
  token: string
) {
  return apiRequest(`/product/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function addProduct(
  formData: FormData,
  token: string
) {
  return apiRequest("/product/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

export function updateProduct(
  id: string,
  formData: FormData,
  token: string
) {
  return apiRequest(`/product/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}
