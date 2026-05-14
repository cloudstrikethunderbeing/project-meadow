import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";

// Hardcoded admin principals — update with real admin principal IDs
const ADMIN_PRINCIPALS: string[] = [
  "aaaaa-aa", // Internet Computer management canister (placeholder)
  // Add real admin principals here e.g.:
  // "rdmx6-jaaaa-aaaaa-aaadq-cai",
];

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity != null;

  const principal = useMemo(() => {
    if (!identity) return null;
    try {
      return identity.getPrincipal().toText();
    } catch {
      return null;
    }
  }, [identity]);

  const isAdmin = useMemo(() => {
    if (!principal) return false;
    return ADMIN_PRINCIPALS.includes(principal);
  }, [principal]);

  return {
    isAuthenticated,
    principal,
    isAdmin,
    loginStatus,
    identity,
    login,
    logout: clear,
  };
}
