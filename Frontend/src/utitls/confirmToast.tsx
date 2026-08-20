// Frontend/src/utitls/confirmToast.tsx
import { toast, type ToastOptions } from "react-toastify";

export function confirmToast(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const toastId = "confirm-toast"; // prevents duplicate confirm toasts stacking

    const options: ToastOptions = {
      toastId,
      position: "top-center", // 👈 Moves ONLY this confirmation toast to top-center
      autoClose: false,       // don't auto-dismiss like normal toasts
      closeOnClick: false,    // don't dismiss when clicking the message area
      draggable: false,
      closeButton: true,
      theme: "light",
      onClose: () => resolve(false), // resolves false if user closes via 'X' button
    };

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm font-medium text-slate-800">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                resolve(false);
                closeToast();
              }}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resolve(true);
                closeToast();
              }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      options
    );
  });
}