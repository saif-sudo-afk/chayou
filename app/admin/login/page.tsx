import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { LogoMark } from "@/components/shop/logo-mark";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="space-y-8">
        <div className="flex justify-center">
          <LogoMark />
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
