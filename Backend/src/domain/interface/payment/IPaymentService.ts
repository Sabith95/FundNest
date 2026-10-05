export interface CreatePaymentOrderInput {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentDetailsResult {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface IPaymentService {
  createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResult>;
  getPayment(paymentId: string): Promise<PaymentDetailsResult>;
}