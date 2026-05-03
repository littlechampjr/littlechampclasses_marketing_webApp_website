const SCRIPT_ID = "razorpay-checkout-js";

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing?.dataset.loaded === "1") {
    return Promise.resolve();
  }
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed")), {
        once: true,
      });
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => reject(new Error("Razorpay script failed"));
    document.body.appendChild(s);
  });
}

export type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayOpenOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOpenOptions) => { open: () => void };
  }
}

export function openRazorpayCheckout(options: RazorpayOpenOptions): void {
  const Ctor = window.Razorpay;
  if (!Ctor) {
    throw new Error("Razorpay is not loaded");
  }
  const rzp = new Ctor(options);
  rzp.open();
}
