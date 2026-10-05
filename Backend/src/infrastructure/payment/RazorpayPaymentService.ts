// import { injectable } from "tsyringe";
// import { env } from "../config/env";
// import {
//   CreatePaymentOrderInput,
//   PaymentOrderResult,
//   PaymentDetailsResult,
//   IPaymentService
// } from "../../domain/interface/payment/IPaymentService";

// @injectable()
// export class RazorpayPaymentService implements IPaymentService {
//   private get authorizationHeader(): string {
//     const credentials = `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_SECRET_KEY}`;
//     return `Basic ${Buffer.from(credentials).toString("base64")}`;
//   }

//   async createOrder(
//     input: CreatePaymentOrderInput,
//   ): Promise<PaymentOrderResult> {
//     const response = await fetch("https://api.razorpay.com/v1/orders", {
//       method: "POST",
//       headers: {
//         Authorization: this.authorizationHeader,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(input),
//     });

//     if (!response.ok) {
//       throw new Error("Unable to create the Razorpay order");
//     }

//     return response.json() as Promise<PaymentOrderResult>;
//   }

//   async getPayment(paymentId: string): Promise<PaymentDetailsResult> {
//     const response = await fetch(
//       `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
//       {
//         headers: {
//           Authorization: this.authorizationHeader,
//         },
//       },
//     );

//     if (!response.ok) {
//       throw new Error("Unable to verify the Razorpay payment");
//     }

//     return response.json() as Promise<PaymentDetailsResult>;
//   }
// }

import { injectable } from "tsyringe";
import { env } from "../config/env";
import {
  CreatePaymentOrderInput,
  PaymentOrderResult,
  PaymentDetailsResult,
  IPaymentService,
} from "../../domain/interface/payment/IPaymentService";

@injectable()
export class RazorpayPaymentService implements IPaymentService {
  private get authorizationHeader(): string {
    const credentials = `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_SECRET_KEY}`;
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  }

  async createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<PaymentOrderResult> {
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

    const data = await response.json();
    return {
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
    };
  }

  async getPayment(paymentId: string): Promise<PaymentDetailsResult> {
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

    const data = await response.json();
    return {
      paymentId: data.id,
      orderId: data.order_id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
    };
  }
}
