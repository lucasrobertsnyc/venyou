"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Runs on every page load. If the user logged in with "Stay signed in"
 * unchecked, we track their session in sessionStorage (which clears when
 * the browser is closed). On the next load — after the browser has been
 * closed — sessionStorage is gone, so we sign them out automatically.
 */
export default function SessionGuard() {
  useEffect(() => {
    const staySignedIn = localStorage.getItem("staySignedIn");
    if (staySignedIn !== "false") return; // default / opted-in: do nothing

    const activeSession = sessionStorage.getItem("activeSession");
    if (!activeSession) {
      // Browser was closed and reopened — clear the stale session
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        window.location.href = "/login";
      });
    }
  }, []);

  return null;
}
