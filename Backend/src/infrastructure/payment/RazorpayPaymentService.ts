import { injectable } from "tsyringe";
import { env } from "../config/env";
import {
  CreateRazorpayOrderInput,
  IRazorpayPaymentService,
  RazorpayOrderResult,
  RazorpayPaymentResult,
} from "../payment/interface/IRazorpayPaymentService";

@injectable()
export class RazorpayPaymentService implements IRazorpayPaymentService {
  private get authorizationHeader(): string {
    const credentials = `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_SECRET_KEY}`;
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  }

  async createOrder(
    input: CreateRazorpayOrderInput,
  ): Promise<RazorpayOrderResult> {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: this.authorizationHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Unable to create the Razorpay order");
    }

    return response.json() as Promise<RazorpayOrderResult>;
  }

  async getPayment(paymentId: string): Promise<RazorpayPaymentResult> {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          Authorization: this.authorizationHeader,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Unable to verify the Razorpay payment");
    }

    return response.json() as Promise<RazorpayPaymentResult>;
  }
}
