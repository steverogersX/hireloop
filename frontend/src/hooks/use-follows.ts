"use client";

import { useSyncExternalStore } from "react";

let followed = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toggleFollow(companyId: string) {
  const next = new Set(followed);
  if (next.has(companyId)) next.delete(companyId);
  else next.add(companyId);
  followed = next;
  emit();
  return followed.has(companyId);
}

export function useIsFollowing(companyId: string) {
  return useSyncExternalStore(
    subscribe,
    () => followed.has(companyId),
    () => false
  );
}

export function useFollowedCompanies() {
  return useSyncExternalStore(
    subscribe,
    () => followed,
    () => followed
  );
}
