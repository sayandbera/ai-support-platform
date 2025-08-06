"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import React from "react";
import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/sign-in-view";

interface Props {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: Props) => (
  <>
    <AuthLoading>
      <AuthLayout>
        <p>Loading...</p>
      </AuthLayout>
    </AuthLoading>

    <Authenticated>{children}</Authenticated>

    <Unauthenticated>
      <AuthLayout>
        <SignInView />
      </AuthLayout>
    </Unauthenticated>
  </>
);
