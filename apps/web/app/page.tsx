"use client";

import { api } from "@workspace/backend/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Page() {
  const getUsers = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Web App</h1>
        <button onClick={() => addUser({ name: `Tom-${Date.now()}` })}>
          Add User
        </button>
        <p>Users data: {JSON.stringify(getUsers, null, 2)}</p>
      </div>
    </div>
  );
}
