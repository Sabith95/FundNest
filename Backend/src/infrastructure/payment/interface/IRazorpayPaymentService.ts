export interface CreateRazorpayOrderInput {
  amount: number;
  currency: "INR";
  receipt: string;
  notes: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface RazorpayPaymentResult {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface IRazorpayPaymentService {
  createOrder(input: CreateRazorpayOrderInput): Promise<RazorpayOrderResult>;
  getPayment(paymentId: string): Promise<RazorpayPaymentResult>;
}
