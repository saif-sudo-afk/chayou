import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BrandWordmark } from "@/components/shop/brand-wordmark";
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
          <BrandWordmark />
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
