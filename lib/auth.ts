import { register, type RegisterPayload } from "@/app/services/authService";

export async function registerUser(payload: RegisterPayload) {
  return register(payload);
}