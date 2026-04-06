import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const emailPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const resetRequestSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(6, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type EmailPasswordValues = z.infer<typeof emailPasswordSchema>;
type ResetRequestValues = z.infer<typeof resetRequestSchema>;
type NewPasswordValues = z.infer<typeof newPasswordSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const isRecovery = searchParams.get("type") === "recovery";

  const { user, loading, signInWithEmail, signUpWithEmail, requestPasswordReset, updatePassword } =
    useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    if (!loading && user && !isRecovery) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, user, navigate, redirectTo, isRecovery]);

  const signInForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotForm = useForm<ResetRequestValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: { email: "" },
  });

  const recoveryForm = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSignIn = async (values: EmailPasswordValues) => {
    setSubmitting(true);
    const ok = await signInWithEmail(values.email, values.password);
    setSubmitting(false);
    if (ok) navigate(redirectTo, { replace: true });
  };

  const onSignUp = async (values: EmailPasswordValues) => {
    setSubmitting(true);
    await signUpWithEmail(values.email, values.password);
    setSubmitting(false);
  };

  const onForgot = async (values: ResetRequestValues) => {
    setSubmitting(true);
    await requestPasswordReset(values.email);
    setSubmitting(false);
    setShowForgot(false);
  };

  const onRecovery = async (values: NewPasswordValues) => {
    setSubmitting(true);
    const ok = await updatePassword(values.password);
    setSubmitting(false);
    if (ok) navigate(redirectTo, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isRecovery) {
    if (!user) {
      return (
        <div className="min-h-screen pt-28 pb-16">
          <div className="container mx-auto max-w-md px-4">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <h1 className="font-heading text-2xl font-bold text-foreground">Reset password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the link from your email on this device, or request a new reset link.
              </p>
              <Button asChild variant="link" className="mt-4 h-auto p-0">
                <Link to="/auth">Back to sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
          <div className="absolute -top-[500px] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
          <div className="container relative mx-auto max-w-md px-4 z-10">
            <div className="rounded-3xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
              <div className="text-center mb-8">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">Choose a new password</h1>
              </div>
              <Form {...recoveryForm}>
                <form onSubmit={recoveryForm.handleSubmit(onRecovery)} className="space-y-5">
                <FormField
                  control={recoveryForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={recoveryForm.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-11 text-base font-semibold group rounded-xl bg-primary text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all duration-300" disabled={submitting}>
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update password"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  if (showForgot) {
    return (
      <div className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute -top-[500px] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="container relative mx-auto max-w-md px-4 z-10">
          <div className="rounded-3xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">Reset password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We will email you a link to choose a new password.
              </p>
            </div>
            <Form {...forgotForm}>
              <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-5">
                <FormField
                  control={forgotForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-2">
                  <Button type="button" variant="ghost" className="h-11 rounded-xl" onClick={() => setShowForgot(false)}>
                    Back to login
                  </Button>
                  <Button type="submit" className="h-11 px-8 text-base font-semibold group rounded-xl bg-primary text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all duration-300" disabled={submitting}>
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      <div className="absolute -top-[500px] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="container relative mx-auto max-w-md px-4 z-10">
        <div className="rounded-3xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your account securely</p>
          </div>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel>Password</FormLabel>
                          <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <FormControl>
                          <Input type="password" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 text-base font-semibold group rounded-xl bg-primary text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all duration-300" disabled={submitting}>
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in to Dashboard"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 text-base font-semibold group rounded-xl bg-primary text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all duration-300" disabled={submitting}>
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create free account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
