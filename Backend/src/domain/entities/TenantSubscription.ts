export type TenantSubscriptionStatus = "ACTIVE" | "EXPIRED";

export interface TenantSubscriptionProps {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  billingCycle: string;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  hasFundSuggestions: boolean;
  startsAt: Date;
  endsAt: Date;
  status: TenantSubscriptionStatus;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TenantSubscription {
  private constructor(private readonly _props: TenantSubscriptionProps) {}

  public static create(props: TenantSubscriptionProps): TenantSubscription {
    return new TenantSubscription({
      ...props,
      startsAt: new Date(props.startsAt),
      endsAt: new Date(props.endsAt),
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
  public get billingCycle(): string {
    return this._props.billingCycle;
  }
  public get durationDays(): number {
    return this._props.durationDays;
  }
  public get maxFunds(): number | null {
    return this._props.maxFunds;
  }
  public get maxUsers(): number | null {
    return this._props.maxUsers;
  }
  public get hasAutopay(): boolean {
    return this._props.hasAutopay;
  }
  public get hasFundSuggestions(): boolean {
    return this._props.hasFundSuggestions;
  }
  public get startsAt(): Date {
    return new Date(this._props.startsAt);
  }
  public get endsAt(): Date {
    return new Date(this._props.endsAt);
  }
  public get status(): TenantSubscriptionStatus {
    return this._props.status;
  }
  public get razorpayOrderId(): string {
    return this._props.razorpayOrderId;
  }
  public get razorpayPaymentId(): string {
    return this._props.razorpayPaymentId;
  }
  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }
  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  public isExpired(): boolean {
    return (
      this._props.status === "ACTIVE" &&
      this._props.endsAt.getTime() < Date.now()
    );
  }

  public markAsExpired(): void {
    this._props.status = "EXPIRED";
    this._props.updatedAt = new Date();
  }

  public canCreateFund(currentFundCount: number): boolean {
    if (this.isExpired()) {
      return false;
    }
    if (this._props.maxFunds === null) {
      return true;
    }
    return currentFundCount < this._props.maxFunds;
  }

  public canAddUser(currentUserCount: number): boolean {
    if (this.isExpired()) {
      return false;
    }
    if (this._props.maxUsers === null) {
      return true;
    }
    return currentUserCount < this._props.maxUsers;
  }

  public supportsAutopay(): boolean {
    return !this.isExpired() && this._props.hasAutopay;
  }

  public supportsFundSuggestions(): boolean {
    return !this.isExpired() && this._props.hasFundSuggestions;
  }
}
