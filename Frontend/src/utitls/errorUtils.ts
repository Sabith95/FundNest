import axios from "axios";

/**
 * Converts caught API or runtime errors into clean, user-friendly messages for toasts.
 *
 * @param error - The caught error object in try/catch
 * @param defaultFallback - Customized fallback message for this specific action
 */
export const getErrorMessage = (
  error: unknown,
  defaultFallback: string = "An unexpected error occurred. Please try again."
): string => {
  // 1. Axios HTTP Errors
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    // Network / No Response from Server
    if (!error.response) {
      return "Network error. Please check your internet connection and try again.";
    }

    // 5xx Server Errors — Hide raw technical internal server error details
    if (status && status >= 500) {
      return "Something went wrong on our server. Please try again later.";
    }

    // 401 Unauthorized
    if (status === 401) {
      return "Your session has expired. Please log in again.";
    }

    // 403 Forbidden
    if (status === 403) {
      return backendMessage || "You do not have permission to perform this action.";
    }

    // 400 / 409 / 422 Business Validation Errors
    if (backendMessage && typeof backendMessage === "string") {
      return backendMessage;
    }
  }

  // 2. Standard Javascript Errors (Filtering out raw technical S3/SDK strings)
  if (error instanceof Error && error.message) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("failed to fetch") ||
      msg.includes("s3") ||
      msg.includes("bucket") ||
      msg.includes("credential")
    ) {
      return defaultFallback;
    }
    return error.message;
  }

  return defaultFallback;
};