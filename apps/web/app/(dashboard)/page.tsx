"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Page() {
  const getUsers = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
      <h1 className="text-2xl font-bold">Web App</h1>
      <UserButton />
      <OrganizationSwitcher hidePersonal={true} />

      <button onClick={() => addUser({ name: `Tom-${Date.now()}` })}>
        Add User
      </button>
    </div>
  );
}
