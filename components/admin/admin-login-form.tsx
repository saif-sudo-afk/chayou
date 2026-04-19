"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function AdminLoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await signIn("credentials", {
      ...values,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    if (response?.error) {
      toast.error("Invalid admin credentials.");
      return;
    }

    toast.success("Welcome back.");
    router.push("/admin/dashboard");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-gold">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <CardTitle>Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
          </div>
          <Button className="w-full" type="submit">
            Access Admin
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
