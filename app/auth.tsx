"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <Button onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}>
      Sign in
    </Button>
  );
};

export const LogoutButton = () => {
  const handleSignOut = () => {
    const callbackUrl = `${window.location.origin}/`;
    signOut({ callbackUrl });
  };

  return (
    <Button variant={"destructive"} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
