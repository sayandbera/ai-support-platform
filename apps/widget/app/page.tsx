"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  const getUsers = useQuery(api.users.getMany);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Widget App</h1>
        <p>Users data: {JSON.stringify(getUsers, null, 2)}</p>
      </div>
    </div>
  );
}
