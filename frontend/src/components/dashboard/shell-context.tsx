"use client";

import { createContext, useContext } from "react";
import type { ActivityItem, User } from "@/types/api";

export interface ShellData {
  user: Pick<User, "id" | "name" | "email" | "headline"> | null;
  activity: ActivityItem[];
}

const ShellContext = createContext<ShellData>({ user: null, activity: [] });

export function ShellProvider({
  value,
  children,
}: {
  value: ShellData;
  children: React.ReactNode;
}) {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  return useContext(ShellContext);
}
