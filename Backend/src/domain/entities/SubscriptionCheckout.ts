export type SubscriptionCheckoutStatus = "CREATED" | "PAID" | "FAILED";

export interface SubscriptionCheckoutProps {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  durationDays: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: SubscriptionCheckoutStatus;
  failureReason?: string;
  expiresAt: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionCheckout {
  private constructor(private readonly _props: SubscriptionCheckoutProps) {}

  public static create(props: SubscriptionCheckoutProps): SubscriptionCheckout {
    return new SubscriptionCheckout({
      ...props,
      expiresAt: new Date(props.expiresAt),
      paidAt: props.paidAt ? new Date(props.paidAt) : undefined,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  public get id(): string {
    return this._props.id;
  }
  public get tenantId(): string {
    return this._props.tenantId;
  }
  public get planId(): string {
    return this._props.planId;
  }
  public get planName(): string {
    return this._props.planName;
  }
  public get planType(): string {
    return this._props.planType;
  }
  public get amount(): number {
    return this._props.amount;
  }
  public get currency(): "INR" {
    return this._props.currency;
  }
  public get durationDays(): number {
    return this._props.durationDays;
  }
  public get razorpayOrderId(): string {
    return this._props.razorpayOrderId;
  }
  public get razorpayPaymentId(): string | undefined {
    return this._props.razorpayPaymentId;
  }
  public get status(): SubscriptionCheckoutStatus {
    return this._props.status;
  }
  public get failureReason(): string | undefined {
    return this._props.failureReason;
  }
  public get expiresAt(): Date {
    return new Date(this._props.expiresAt);
  }
  public get paidAt(): Date | undefined {
    return this._props.paidAt ? new Date(this._props.paidAt) : undefined;
  }
  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }
  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  public markAsPaid(paymentId: string, paidAt: Date = new Date()): void {
    this._props.status = "PAID";
    this._props.razorpayPaymentId = paymentId;
    this._props.paidAt = paidAt;
    this._props.failureReason = undefined;
    this._props.updatedAt = new Date();
  }

  public markAsFailed(reason: string): void {
    this._props.status = "FAILED";
    this._props.failureReason = reason;
    this._props.updatedAt = new Date();
  }

  public isExpired(): boolean {
    return (
      this._props.status !== "PAID" &&
      this._props.expiresAt.getTime() < Date.now()
    );
  }
}
