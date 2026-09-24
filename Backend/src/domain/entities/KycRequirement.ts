import { KycDocumentType } from "../../shared/constants/enums/KycDocumentType";

export interface KycRequirementProps {
  id: string;
  documentType: KycDocumentType;
  title: string;
  description?: string;
  isRequired: boolean;
  requiresBothSides: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMb: number;
}

export class KycRequirement {
  private constructor(private readonly _props: KycRequirementProps) {}

  public static create(props: KycRequirementProps): KycRequirement {
    KycRequirement.validate(props);
    return new KycRequirement({
      ...props,
      allowedMimeTypes: props.allowedMimeTypes?.length
        ? props.allowedMimeTypes
        : ["image/jpeg", "image/png", "application/pdf"],
      maxFileSizeMb: props.maxFileSizeMb > 0 ? props.maxFileSizeMb : 5,
    });
  }

  public get id(): string {
    return this._props.id;
  }

  public get documentType(): KycDocumentType {
    return this._props.documentType;
  }

  public get title(): string {
    return this._props.title;
  }

  public get description(): string | undefined {
    return this._props.description;
  }

  public get isRequired(): boolean {
    return this._props.isRequired;
  }

  public get requiresBothSides(): boolean {
    return this._props.requiresBothSides;
  }

  public get allowedMimeTypes(): string[] {
    return [...this._props.allowedMimeTypes];
  }

  public get maxFileSizeMb(): number {
    return this._props.maxFileSizeMb;
  }

  public toJSON(): KycRequirementProps {
    return { ...this._props };
  }

  private static validate(props: KycRequirementProps): void {
    if (!props.id?.trim()) {
      throw new Error("Requirement ID is required");
    }
    if (!props.title?.trim()) {
      throw new Error("Requirement title is required");
    }
    if (
      !props.documentType ||
      !Object.values(KycDocumentType).includes(props.documentType)
    ) {
      throw new Error("Valid document type is required");
    }
    if (props.maxFileSizeMb !== undefined && props.maxFileSizeMb <= 0) {
      throw new Error("Max file size must be greater than 0 MB");
    }
  }
}
