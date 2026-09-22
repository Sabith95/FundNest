import type {
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayFailureError,
} from "../types/razorpay";

const RAZORPAY_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export type RazorpayCheckoutResult =
  | { type: "SUCCESS"; response: RazorpaySuccessResponse }
  | { type: "FAILED"; error: RazorpayFailureError }
  | { type: "DISMISSED" };

export const loadRazorpayCheckout = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay Checkout")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay Checkout"));

    document.body.appendChild(script);
  });

// export const openRazorpayCheckout = async (
//   options: Omit<RazorpayOptions, "handler" | "modal">,
// ): Promise<RazorpayCheckoutResult> => {
//   await loadRazorpayCheckout();

//   const Razorpay = window.Razorpay;
//   if (!Razorpay) {
//     throw new Error("Razorpay Checkout is unavailable");
//   }

//   return new Promise((resolve) => {
//     let isHandled = false;

//     const razorpay = new Razorpay({
//       ...options,
//       handler: (response) => {
//         isHandled = true;
//         resolve({ type: "SUCCESS", response });
//       },
//       modal: {
//         ondismiss: () => {
//           if (!isHandled) {
//             resolve({ type: "DISMISSED" });
//           }
//         },
//       },
//     });

//     razorpay.on("payment.failed", (response) => {
//       isHandled = true;
//       resolve({
//         type: "FAILED",
//         error: response.error || { description: "Payment processing failed" },
//       });
//     });

//     razorpay.open();
//   });
// };


export const openRazorpayCheckout = async (
  options: Omit<RazorpayOptions, "handler" | "modal">,
): Promise<RazorpayCheckoutResult> => {
  await loadRazorpayCheckout();

  const Razorpay = window.Razorpay;
  if (!Razorpay) {
    throw new Error("Razorpay Checkout is unavailable");
  }

  return new Promise((resolve) => {
    let isSuccess = false;
    let successResponse: RazorpaySuccessResponse | null = null;
    let failureError: RazorpayFailureError | null = null;

    const razorpay = new Razorpay({
      ...options,
      handler: (response) => {
        isSuccess = true;
        successResponse = response;
        resolve({ type: "SUCCESS", response });
      },
      modal: {
        ondismiss: () => {
          // Triggered when the customer closes the Razorpay popup window
          if (isSuccess && successResponse) {
            resolve({ type: "SUCCESS", response: successResponse });
          } else if (failureError) {
            resolve({ type: "FAILED", error: failureError });
          } else {
            resolve({ type: "DISMISSED" });
          }
        },
      },
    });

    razorpay.on("payment.failed", (response) => {
      // Store the failure error. The promise resolves once the user closes the modal window.
      failureError = response.error || { description: "Payment processing failed" };
    });

    razorpay.open();
  });
};