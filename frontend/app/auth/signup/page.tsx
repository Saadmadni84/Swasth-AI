"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const strength = useMemo(() => {
    const pwd = formData.password || "";
    const length8 = pwd.length >= 8;
    const length12 = pwd.length >= 12;
    const lower = /[a-z]/.test(pwd);
    const upper = /[A-Z]/.test(pwd);
    const number = /\d/.test(pwd);
    const symbol = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;
    if (length8) score += 1;
    if (lower) score += 1;
    if (upper) score += 1;
    if (number) score += 1;
    if (symbol) score += 1;
    if (length12) score += 1;

    const percent = Math.round((score / 6) * 100);
    let label = "Very weak";
    if (score >= 5) label = "Very strong";
    else if (score === 4) label = "Strong";
    else if (score === 3) label = "Good";
    else if (score === 2) label = "Fair";
    else if (score <= 1) label = "Weak";

    const color = score >= 5 ? "bg-emerald-500" :
                  score === 4 ? "bg-green-500" :
                  score === 3 ? "bg-yellow-500" :
                  score === 2 ? "bg-orange-500" :
                  "bg-red-500";

    return {
      percent,
      label,
      color,
      checks: { length8, lower, upper, number, symbol },
    };
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        { name: formData.name }
      );

      if (signUpError) {
        const anyErr: any = signUpError;
        const code = anyErr?.code as string | undefined;
        const name = anyErr?.name as string | undefined;
        const reasons: string[] | undefined =
          (anyErr?.reasons as string[]) || (anyErr?.cause?.reasons as string[]);

        if (code === "user_already_exists") {
          setError("An account already exists with this email. Try signing in instead.");
        } else if (code === "weak_password" || name === "AuthWeakPasswordError") {
          if (reasons?.includes("length")) {
            setError("Password is too weak: it must be at least 8 characters long.");
          } else {
            setError("Password is too weak. Please choose a stronger password.");
          }
        } else {
          setError(anyErr?.message || "Failed to create account. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Safe redirect handling
      let redirectUrl = "/auth/login"; // default fallback
      if (data?.user && !data.session) {
        redirectUrl = `/auth/login?message=check-email&email=${encodeURIComponent(formData.email)}`;
      } else if (data?.session) {
        redirectUrl = "/dashboard";
      } else {
        redirectUrl = "/auth/login?registered=true";
      }

      router.push(redirectUrl);
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <div className="p-2 sm:p-3 text-xs sm:text-sm bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
              <div className="space-y-2 pt-1">
                <div className="h-2 w-full bg-muted rounded">
                  <div
                    className={`h-2 rounded transition-all ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Strength: <span className="font-medium text-foreground">{strength.label}</span></span>
                  <span>{strength.percent}%</span>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <li className={`flex items-center gap-2 ${strength.checks.length8 ? 'text-foreground' : ''}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${strength.checks.length8 ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${strength.checks.lower ? 'text-foreground' : ''}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${strength.checks.lower ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                    Lowercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${strength.checks.upper ? 'text-foreground' : ''}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${strength.checks.upper ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                    Uppercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${strength.checks.number ? 'text-foreground' : ''}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${strength.checks.number ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                    Number
                  </li>
                  <li className={`flex items-center gap-2 ${strength.checks.symbol ? 'text-foreground' : ''}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${strength.checks.symbol ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                    Symbol
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full h-9 sm:h-10 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:space-y-4">
          <div className="text-xs sm:text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
