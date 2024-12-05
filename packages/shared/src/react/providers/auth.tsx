"use client";
import { useBoolean } from "@rafty/ui";
import { useQueryClient } from "@tanstack/react-query";
import { type User, browserLocalPersistence, getAuth } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import type z from "zod";
import { useProfile } from "../queries/useProfile";
import { COOKIE_TOKEN_KEY, endpoint } from "../utils";
import { type userPasswordValidation, userValidation } from "../validations";

const nameValidation = userValidation.pick({
  first_name: true,
  last_name: true,
});

const AuthContext = createContext<ReturnType<typeof useAuthManager> | null>(
  null,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const value = useAuthManager();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const AUTH_TOAST_ID = "auth-status-toast";
const COOKIE_OPTIONS = { path: "/" };
const AUTH_REFRESH_INTERVAL = 10 * 60 * 1000;

function useAuthManager() {
  const auth = getAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useBoolean();

  auth.setPersistence(browserLocalPersistence);

  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [_, setCookie, removeCookie] = useCookies([COOKIE_TOKEN_KEY]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is a subscription that should only run once
  useEffect(() => {
    const unsubscriber = auth.onIdTokenChanged(async (user) => {
      // Setting the user
      setUser(user);
      // Setting the token
      if (user)
        setCookie(COOKIE_TOKEN_KEY, await user.getIdToken(), COOKIE_OPTIONS);
      // Clearing the tokens if the user is not present
      else cleanup();
    });

    return () => {
      unsubscriber();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is a subscription that should only run once
  useEffect(() => {
    auth.authStateReady().then(() => setIsReady(true));
  }, []);

  // force refresh the token every 10 minutes
  // biome-ignore lint/correctness/useExhaustiveDependencies: subscription
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, AUTH_REFRESH_INTERVAL);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile();

  const signout = async () => {
    // Clearing all the data
    queryClient.clear();

    // Logout the user
    auth.signOut().catch((err) => {
      console.error(err);
      toast.error(err.message, { id: AUTH_TOAST_ID });
    });
    cleanup(false);
  };

  const cleanup = (redirect = true) => {
    removeCookie(COOKIE_TOKEN_KEY, COOKIE_OPTIONS);

    if (pathname === "/signin" || pathname === "/signin/decole") return;

    let params = "";
    if (redirect) params = `?redirect=${pathname}`;

    router.push(`/signin${params}`);
  };

  const updateName = (values: z.infer<typeof nameValidation>) =>
    endpoint
      .post("/user/name", values)
      .then(() => toast.success("Name updated successfully"))
      .catch((err) => {
        console.error(err);
        toast.error(err.message, { id: AUTH_TOAST_ID });
      });

  const updatePassword = (values: z.infer<typeof userPasswordValidation>) =>
    endpoint
      .post("/user/password", values)
      .then(() => toast.success("Password updated successfully"))
      .catch((err) => {
        console.error(err);
        toast.error(err.message, { id: AUTH_TOAST_ID });
      });

  return {
    user,
    isReady,
    profile,
    isProfileLoading,
    isProfileError,
    signout,
    updateName,
    updatePassword,
  };
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("Missing AuthContext.Provider in the tree!");

  return context;
};
