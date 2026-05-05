import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { loginAction } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) redirect("/admin/events");
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-6">
      <h1 className="mb-4 text-2xl font-semibold">Admin login</h1>
      {params.error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Invalid password. Try again.
        </p>
      )}
      <form action={loginAction} className="space-y-3">
        <input
          type="password"
          name="password"
          placeholder="Admin password"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        <button className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}
