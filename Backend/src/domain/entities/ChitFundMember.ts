export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  DEFAULTED = "DEFAULTED",
  COMPLETED = "COMPLETED",
}

export interface ChitFundMemberProps {
  id: string;
  fundId: string;
  tenantId: string;
  userId: string;
  joinRequestId: string;
  slotNumber: number;
  initialContributionPaise: number;
  joinedAt: Date;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ChitFundMember {
  private constructor(private readonly _props: ChitFundMemberProps) {}

  public static create(props: ChitFundMemberProps): ChitFundMember {
    ChitFundMember.validate(props);
    return new ChitFundMember({
      ...props,
      joinedAt: new Date(props.joinedAt),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  public get id(): string {
    return this._props.id;
  }

  public get fundId(): string {
    return this._props.fundId;
  }

  public get tenantId(): string {
    return this._props.tenantId;
  }

  public get userId(): string {
    return this._props.userId;
  }

  public get joinRequestId(): string {
    return this._props.joinRequestId;
  }

  public get slotNumber(): number {
    return this._props.slotNumber;
  }

  public get initialContributionPaise(): number {
    return this._props.initialContributionPaise;
  }

  public get joinedAt(): Date {
    return new Date(this._props.joinedAt);
  }

  public get status(): MembershipStatus {
    return this._props.status;
  }

  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  private static validate(props: ChitFundMemberProps): void {
    if (!props.fundId?.trim()) throw new Error("Fund ID is required");
    if (!props.tenantId?.trim()) throw new Error("Tenant ID is required");
    if (!props.userId?.trim()) throw new Error("User ID is required");
    if (props.slotNumber <= 0) throw new Error("Slot number must be greater than zero");
    if (props.initialContributionPaise <= 0) throw new Error("Initial contribution must be greater than zero");
  }
}
