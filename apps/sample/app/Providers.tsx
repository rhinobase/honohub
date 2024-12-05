"use client";
import {
  AuthProvider,
  CancelUploadDialog,
  OrganizationProvider,
  ShikiProvider,
  UploadDialog,
  UploadProvider,
} from "@honohub/shared";
import { Toast } from "@rafty/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type PropsWithChildren, Suspense } from "react";
import toast, { Toaster, resolveValue } from "react-hot-toast";
import { firebaseClient } from "../config/firebase/client";
import { StorageProvider } from "../providers";

// Creating the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (err, query) => {
        console.error(query, err);
        errorHandler(err);

        return false;
      },
      staleTime: Number.POSITIVE_INFINITY,
    },
    mutations: {
      onError: (err) => {
        console.error(err);
        errorHandler(err);
      },
    },
  },
});

export function Providers({ children }: PropsWithChildren) {
  // Initializing Firebase
  firebaseClient();

  return (
    <Suspense>
      <ThemeProvider
        attribute="class"
        enableSystem
        defaultTheme="system"
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UploadProvider>
              <OrganizationProvider>
                <StorageProvider>
                  <ShikiProvider>
                    <NuqsAdapter>{children}</NuqsAdapter>
                  </ShikiProvider>
                  <UploadDialog />
                  <CancelUploadDialog />
                </StorageProvider>
              </OrganizationProvider>
            </UploadProvider>
          </AuthProvider>
        </QueryClientProvider>
        <Toaster>
          {(t) => (
            <Toast
              visible={t.visible}
              severity={t.type as ToastType}
              title={String(resolveValue(t.message, t))}
            />
          )}
        </Toaster>
      </ThemeProvider>
    </Suspense>
  );
}

type ToastType = "success" | "error" | "warning" | "info";

function errorHandler(err: unknown) {
  let errorMessage: string | undefined;

  if (isAxiosError(err)) {
    const { response, message } = err;
    errorMessage = response?.data.message ?? message;
  }

  toast.error(errorMessage ?? "Something went wrong!");
}
