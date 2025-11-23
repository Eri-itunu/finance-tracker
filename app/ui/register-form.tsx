"use client";

import { useActionState } from "react";
import { register, registerState } from "@/lib/actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PersonStanding } from "lucide-react";
import { AtSign, Key } from "lucide-react";

export default function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    {} as registerState
  );


  return (
    <form action={formAction} className="w-full max-w-md mx-auto">
      <Card className="p-6 rounded-2xl shadow-md border bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your First Name"
                required
                className="pl-10"
              />
              <PersonStanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errorMessage?.errors?.firstName && (
              <p className="text-sm text-red-500">
                {errorMessage.errors.firstName[0]}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your Last Name"
                required
                className="pl-10"
              />
              <PersonStanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errorMessage?.errors?.lastName && (
            <p className="text-sm text-red-500">
                {errorMessage.errors.lastName[0]}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="pl-10"
              />
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
             {errorMessage?.errors?.email && (
            <p className="text-sm text-red-500">
              {errorMessage.errors.email[0]}
            </p>
          )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                minLength={6}
                required
                className="pl-10"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errorMessage?.errors?.password && (
              <p className="text-sm text-red-500">
                {errorMessage.errors.password[0]}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                minLength={6}
                required
                className="pl-10"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errorMessage?.errors?.confirmPassword && (
              <p className="text-sm text-green-500">
                {errorMessage.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* General Form Errors */}
          
          {errorMessage?.message && (
            <Alert variant="destructive" className="mt-2">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Registering..." : "Register"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}