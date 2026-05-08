"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";

export function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const storeUser = useMutation(api.users.storeUser);
  const syncStarted = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !syncStarted.current) {
      syncStarted.current = true;
      storeUser()
        .then(() => console.log("User synced successfully"))
        .catch((err) => {
          console.error("Sync failed", err);
          syncStarted.current = false;
        });
    }
  }, [isLoaded, isSignedIn, user, storeUser]);

  return null;
}
