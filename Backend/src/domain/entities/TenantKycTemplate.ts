import { KycRequirement, KycRequirementProps } from "./KycRequirement";

export interface TenantKycTemplateProps {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  requirements: KycRequirementProps[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TenantKycTemplate {
  private constructor(private readonly _props: TenantKycTemplateProps) {}

  public static create(props: TenantKycTemplateProps): TenantKycTemplate {
    TenantKycTemplate.validate(props);

    return new TenantKycTemplate({
      ...props,
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

  public get name(): string {
    return this._props.name;
  }

  public get description(): string | undefined {
    return this._props.description;
  }

  public get requirements(): KycRequirementProps[] {
    return this._props.requirements.map((r) => ({ ...r }));
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
  public activate(): void {
    this._props.isActive = true;
    this.touch();
  }

  public deactivate(): void {
    this._props.isActive = false;
    this.touch();
  }

  public updateTemplate(
    name: string,
    description: string | undefined,
    requirements: KycRequirementProps[],
  ): void {
    const updated = {
      ...this._props,
      name,
      description,
      requirements,
    };
    TenantKycTemplate.validate(updated);

    this._props.name = name;
    this._props.description = description;
    this._props.requirements = requirements;
    this.touch();
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  private static validate(props: TenantKycTemplateProps): void {
    if (!props.tenantId?.trim()) {
      throw new Error("Tenant ID is required for a KYC template");
    }
    if (!props.name?.trim()) {
      throw new Error("KYC template name is required");
    }
    if (!Array.isArray(props.requirements)) {
      throw new Error("Requirements must be an array");
    }

    // Validate each requirement
    const seenIds = new Set<string>();
    for (const req of props.requirements) {
      if (seenIds.has(req.id)) {
        throw new Error(`Duplicate requirement ID: ${req.id}`);
      }
      seenIds.add(req.id);
      KycRequirement.create(req); // will throw if invalid
    }
  }
}
