import { BillingCycle } from "../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../shared/constants/enums/PlanType";

export interface SubscriptionPlanProps {
  id: string;
  planType: PlanType;
  name: string;
  price: number;

  billingCycle: BillingCycle;
  durationDays: number;

  maxFunds: number | null;
  maxUsers: number | null;

  hasAutopay: boolean;
  hasFundSuggestions: boolean;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionPlan {
  private constructor(private readonly _props: SubscriptionPlanProps) {}

  public static create(_props: SubscriptionPlanProps): SubscriptionPlan {
    SubscriptionPlan.validate(_props);

    return new SubscriptionPlan({
      ..._props,
      createdAt: new Date(_props.createdAt),
      updatedAt: new Date(_props.updatedAt),
    });
  }

  // getters

  public get id(): string {
    return this._props.id;
  }

  public get name(): string {
    return this._props.name;
  }

  public get price(): number {
    return this._props.price;
  }

  public get billingCycle(): BillingCycle {
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

  public get isActive(): boolean {
    return this._props.isActive;
  }

  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  public get planType(): PlanType {
    return this._props.planType;
  }

  // domain behaviour

  public activate(): void {
    if (this._props.isActive) {
      return;
    }

    this._props.isActive = true;
    this.touch();
  }

  public deactivate(): void {
    if (!this._props.isActive) {
      return;
    }

    this._props.isActive = false;
    this.touch();
  }

  public canCreateFund(currentFundCount: number): boolean {
    if (!this._props.isActive) {
      return false;
    }

    if (this._props.maxFunds === null) {
      return true;
    }

    return currentFundCount < this._props.maxFunds;
  }

  public canAddUser(currentUserCount: number): boolean {
    if (!this._props.isActive) {
      return false;
    }

    if (this._props.maxUsers === null) {
      return true;
    }

    return currentUserCount < this._props.maxUsers;
  }

  public supportsAutopay(): boolean {
    return this._props.hasAutopay;
  }

  public supportsFundSuggestions(): boolean {
    return this._props.hasFundSuggestions;
  }

  public updateDetails(
    details: Partial<
      Pick<
        SubscriptionPlanProps,
        | "name"
        | "price"
        | "billingCycle"
        | "durationDays"
        | "maxFunds"
        | "maxUsers"
        | "hasAutopay"
        | "hasFundSuggestions"
      >
    >,
  ): void {
    const updatedProps = {
      ...this._props,
      ...details,
    };

    SubscriptionPlan.validate(updatedProps);

    Object.assign(this._props, details);

    this.touch();
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  private static validate(props: SubscriptionPlanProps): void {
    if (!props.name.trim()) {
      throw new Error("Subscription plan name is required");
    }

    if (props.price < 0) {
      throw new Error("Subscription plan price cannot be negative");
    }

    if (props.durationDays <= 0) {
      throw new Error("Subscription duration must be greater than zero");
    }

    if (props.maxFunds !== null && props.maxFunds <= 0) {
      throw new Error("Maximum funds must be greater than zero or null");
    }

    if (props.maxUsers !== null && props.maxUsers <= 0) {
      throw new Error("Maximum users must be greater than zero or null");
    }
  }
}
