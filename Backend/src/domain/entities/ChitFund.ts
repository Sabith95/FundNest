import { FundType } from "../../shared/constants/enums/FundType";

export interface ChitFundProps {
  id: string;

  tenantId: string;

  name: string;
  description?: string;

  fundType: FundType;

  chitValue: number;
  contributionAmount: number;

  durationMonths: number;

  totalMembers: number;
  currentMembersCount: number;

  startDate: Date;

  division: number | null;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export class ChitFund {
  private constructor(private readonly _props: ChitFundProps) {}

  public static create(props: ChitFundProps): ChitFund {
    ChitFund.validate(props);

    return new ChitFund({
      ...props,
      startDate: new Date(props.startDate),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  // Getters
  public get id(): string {
    return this._props.id;
  }

  public get tenantId(): string {
    return this._props.tenantId;
  }

  public get name(): string {
    return this._props.name;
  }

  public get description(): string | undefined {
    return this._props.description;
  }

  public get fundType(): FundType {
    return this._props.fundType;
  }

  public get chitValue(): number {
    return this._props.chitValue;
  }

  public get contributionAmount(): number {
    return this._props.contributionAmount;
  }

  public get durationMonths(): number {
    return this._props.durationMonths;
  }

  public get totalMembers(): number {
    return this._props.totalMembers;
  }

  public get currentMembersCount(): number {
    return this._props.currentMembersCount;
  }

  public get startDate(): Date {
    return new Date(this._props.startDate);
  }

  public get division(): number | null {
    return this._props.division;
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

  // Domain Behaviors
  public block(): void {
    if (!this._props.isActive) return;
    this._props.isActive = false;
    this.touch();
  }

  public unblock(): void {
    if (this._props.isActive) return;
    this._props.isActive = true;
    this.touch();
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  private static validate(props: ChitFundProps): void {
    if (!props.tenantId || !props.tenantId.trim()) {
      throw new Error("Tenant ID is required for a Chit Fund");
    }

    if (!props.name || !props.name.trim()) {
      throw new Error("Chit Fund name is required");
    }

    if (props.chitValue <= 0) {
      throw new Error("Chit value must be greater than zero");
    }

    if (props.contributionAmount <= 0) {
      throw new Error("Contribution amount must be greater than zero");
    }

    if (props.durationMonths <= 0) {
      throw new Error("Duration in months must be greater than zero");
    }

    if (props.totalMembers <= 0) {
      throw new Error("Total members count must be greater than zero");
    }

    if (props.currentMembersCount < 0) {
      throw new Error("Current members count cannot be negative");
    }

    if (props.fundType === FundType.NORMAL) {
      if (props.division !== null && props.division !== undefined && props.division !== 1) {
        throw new Error("Normal chit funds must not have multi-division specified (division must be null or 1)");
      }
    } else if (props.fundType === FundType.MULTI_DIVISION) {
      if (!props.division || props.division < 2) {
        throw new Error("Multi-division chit funds must have division specified (must be at least 2, typically 3 or 4)");
      }
    }
  }
}
