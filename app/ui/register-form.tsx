"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useActionState } from "react";
import { register, registerState } from "@/lib/actions";

export default function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    {} as registerState
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl text-center">Please Register</h1>

        {/* First Name */}
        <div>
          <label
            className="mb-3 block text-xs font-medium text-gray-900"
            htmlFor="firstName"
          >
            First Name
          </label>
          <div className="relative">
            <input
              className="peer text-[16px] block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-none"
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Enter your First Name"
              required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errorMessage?.errors?.firstName && (
            <p className="text-sm text-red-500">
              {errorMessage.errors.firstName[0]}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            className="mb-3 block text-xs font-medium text-gray-900"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <div className="relative">
            <input
              className="peer text-[16px] block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-none"
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Enter your Last Name"
              required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errorMessage?.errors?.lastName && (
            <p className="text-sm text-red-500">
              {errorMessage.errors.lastName[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            className="mb-3 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer text-[16px] block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-none"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errorMessage?.errors?.email && (
            <p className="text-sm text-red-500">
              {errorMessage.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mt-4">
          <label
            className="mb-3 block text-xs font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="peer block text-[16px] w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-none"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errorMessage?.errors?.password && (
            <p className="text-sm text-red-500">
              {errorMessage.errors.password[0]}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <label
            className="mb-3 block text-xs font-medium text-gray-900"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full text-[16px] rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-none"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              minLength={6}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errorMessage?.errors?.confirmPassword && (
            <p className="text-sm text-green-500">
              {errorMessage.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center disabled:bg-gray-400"
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isPending ? "Registering..." : "Register"}
          <ArrowRightIcon className="ml-2 h-5 w-5 text-gray-50" />
        </button>

        {/* General Form Errors */}
        <div className="flex h-8 items-end space-x-1">
          {errorMessage?.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-green-500">{errorMessage.message}</p>
            </>
          )}
        </div>

        <div>
          <Link href="/"> Log in </Link>
        </div>
      </div>
    </form>
  );
}
