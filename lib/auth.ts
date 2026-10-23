export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

/**
 * PLACEHOLDER: no backend is connected yet.
 * Replace the body with a real call, e.g. fetch("/api/register", { method: "POST", body: JSON.stringify(data) })
 * or your auth provider (NextAuth, Clerk, Supabase, Firebase...).
 * Throw an Error with a friendly message to show it in the form.
 */
export async function registerUser(data: RegisterInput): Promise<void> {
  await new Promise((r) => setTimeout(r, 900));
  console.info("register (demo only):", { ...data, password: "***" });
}
