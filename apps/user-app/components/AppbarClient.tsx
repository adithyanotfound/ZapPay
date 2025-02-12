"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "../components/Appbar";

export function AppbarClient() {
  const session = useSession();

  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut({ callbackUrl: "/auth/login" });
        }}
        user={session.data?.user}
      />
    </div>
  );
}