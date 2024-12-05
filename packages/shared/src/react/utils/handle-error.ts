import { isAxiosError } from "axios";
import type { Path, UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";
import { ZodError } from "zod";

export function handleError<T extends Record<string, unknown>>(
  err: unknown,
  setError?: UseFormSetError<T>,
) {
  console.error(err);

  if (isAxiosError(err)) {
    const errorResponse = err.response?.data;

    if (setError && errorResponse) {
      // Handling zod errors
      const zodErrors = errorResponse.error;
      if (
        zodErrors &&
        typeof zodErrors === "object" &&
        "name" in zodErrors &&
        "issues" in zodErrors &&
        zodErrors.name === "ZodError" &&
        Array.isArray(zodErrors.issues)
      ) {
        const zodError = ZodError.create(zodErrors.issues);

        for (const issue of zodError.issues) {
          const name = issue.path.join(".");
          setError(name as Path<T>, {
            type: issue.code,
            message: issue.message,
          });
        }
      }
      // Handling AJV errors
      else if (
        Array.isArray(errorResponse) &&
        errorResponse.length > 0 &&
        errorResponse[0].instancePath != null
      ) {
        for (const error of errorResponse) {
          const path = error.instancePath.split("/").join(".");
          const name = [path, error.params?.missingProperty]
            .filter(Boolean)
            .join(".");

          setError(name as Path<T>, {
            type: error.params?.keyword ?? "validation",
            message: error.message,
          });
        }
      }
      // Handling other errors
      else {
        toast.error(errorResponse.message ?? "Something went wrong!");
      }
    }
  } else toast.error("Something went wrong!");
}
