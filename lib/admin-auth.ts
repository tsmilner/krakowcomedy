import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_KEY = "kcc_admin_session";

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(SESSION_KEY)?.value === "1";
}

export async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");
}

export async function loginWithPassword(password: string) {
  if (!password) return false;
  if (password !== process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  store.set(SESSION_KEY, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return true;
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(SESSION_KEY);
}
