"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required, must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        callbackUrl,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.ok && result.url) {
        router.push(result.url);
      } else if (result?.error === 'CredentialsSignin') {
        toast.error('Invalid username or password');
      } else if (result?.error) {
        toast.error(`Login failed: ${result.error}`);
      } else {
        toast.error('An unknown error occurred');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>
            Sign in with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                >
                  Sign in with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  Sign in with Google
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex-grow border-t border-border" />
                <span>Or continue with</span>
                <div className="flex-grow border-t border-border" />
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    {...register('username')}
                    required
                    autoComplete="username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/about/contact"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    {...register('password')}
                    required
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By continuing, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}