export enum FundJoinStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum DocumentVerificationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface SubmittedKycDocument {
  requirementId: string;
  documentType: string;
  title: string;
  frontSideKey: string;
  backSideKey?: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
}

export interface FundJoinRequestProps {
  id: string;
  fundId: string;
  tenantId: string;
  userId: string;
  kycTemplateId?: string;
  documents: SubmittedKycDocument[];
  status: FundJoinStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: Date;
  slotNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class FundJoinRequest {
  private constructor(private readonly _props: FundJoinRequestProps) {}

  public static create(props: FundJoinRequestProps): FundJoinRequest {
    FundJoinRequest.validate(props);
    return new FundJoinRequest({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
      reviewedAt: props.reviewedAt ? new Date(props.reviewedAt) : undefined,
      paidAt: props.paidAt ? new Date(props.paidAt) : undefined,
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

  public get kycTemplateId(): string | undefined {
    return this._props.kycTemplateId;
  }

  public get documents(): SubmittedKycDocument[] {
    return this._props.documents.map((d) => ({ ...d }));
  }

  public get status(): FundJoinStatus {
    return this._props.status;
  }

  public get rejectionReason(): string | undefined {
    return this._props.rejectionReason;
  }

  public get reviewedBy(): string | undefined {
    return this._props.reviewedBy;
  }

  public get reviewedAt(): Date | undefined {
    return this._props.reviewedAt ? new Date(this._props.reviewedAt) : undefined;
  }

  public get razorpayOrderId(): string | undefined {
    return this._props.razorpayOrderId;
  }

  public get razorpayPaymentId(): string | undefined {
    return this._props.razorpayPaymentId;
  }

  public get paidAt(): Date | undefined {
    return this._props.paidAt ? new Date(this._props.paidAt) : undefined;
  }

  public get slotNumber(): number | undefined {
    return this._props.slotNumber;
  }

  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  // Domain Behaviors
  public approve(reviewerId: string): void {
    if (this._props.status !== FundJoinStatus.PENDING_VERIFICATION) {
      throw new Error(`Cannot approve a request with status ${this._props.status}`);
    }
    this._props.status = FundJoinStatus.APPROVED;
    this._props.reviewedBy = reviewerId;
    this._props.reviewedAt = new Date();
    this._props.rejectionReason = undefined;
    // Mark all documents as accepted
    this._props.documents = this._props.documents.map((doc) => ({
      ...doc,
      status: DocumentVerificationStatus.ACCEPTED,
      rejectionReason: undefined,
    }));
    this.touch();
  }

  public reject(
    reviewerId: string,
    rejectionReason: string,
    documentReviews?: Array<{ requirementId: string; status: DocumentVerificationStatus; rejectionReason?: string }>,
  ): void {
    if (this._props.status !== FundJoinStatus.PENDING_VERIFICATION) {
      throw new Error(`Cannot reject a request with status ${this._props.status}`);
    }
    this._props.status = FundJoinStatus.REJECTED;
    this._props.reviewedBy = reviewerId;
    this._props.reviewedAt = new Date();
    this._props.rejectionReason = rejectionReason;

    if (documentReviews && documentReviews.length > 0) {
      const reviewMap = new Map(documentReviews.map((r) => [r.requirementId, r]));
      this._props.documents = this._props.documents.map((doc) => {
        const review = reviewMap.get(doc.requirementId);
        if (review) {
          return {
            ...doc,
            status: review.status,
            rejectionReason: review.rejectionReason,
          };
        }
        return doc;
      });
    }
    this.touch();
  }

  public reupload(updatedDocs: SubmittedKycDocument[]): void {
    if (this._props.status !== FundJoinStatus.REJECTED) {
      throw new Error("Can only re-upload documents for a rejected request");
    }
    // Replace or merge updated docs
    const updatedMap = new Map(updatedDocs.map((d) => [d.requirementId, d]));
    this._props.documents = this._props.documents.map((oldDoc) => {
      const fresh = updatedMap.get(oldDoc.requirementId);
      if (fresh) {
        return {
          ...fresh,
          status: DocumentVerificationStatus.PENDING,
          rejectionReason: undefined,
        };
      }
      return oldDoc;
    });

    // Also add any completely new docs if any
    for (const fresh of updatedDocs) {
      if (!this._props.documents.some((d) => d.requirementId === fresh.requirementId)) {
        this._props.documents.push({
          ...fresh,
          status: DocumentVerificationStatus.PENDING,
        });
      }
    }

    this._props.status = FundJoinStatus.PENDING_VERIFICATION;
    this._props.rejectionReason = undefined;
    this.touch();
  }

  public setPaymentPending(orderId: string): void {
    if (this._props.status !== FundJoinStatus.APPROVED && this._props.status !== FundJoinStatus.PAYMENT_PENDING) {
      throw new Error("Payment can only be initiated for approved requests");
    }
    this._props.status = FundJoinStatus.PAYMENT_PENDING;
    this._props.razorpayOrderId = orderId;
    this.touch();
  }

  public completeEnrollment(paymentId: string, slotNumber: number): void {
    if (this._props.status !== FundJoinStatus.PAYMENT_PENDING && this._props.status !== FundJoinStatus.APPROVED) {
      throw new Error("Cannot complete enrollment: invalid status");
    }
    this._props.status = FundJoinStatus.COMPLETED;
    this._props.razorpayPaymentId = paymentId;
    this._props.paidAt = new Date();
    this._props.slotNumber = slotNumber;
    this.touch();
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  private static validate(props: FundJoinRequestProps): void {
    if (!props.fundId?.trim()) throw new Error("Fund ID is required");
    if (!props.tenantId?.trim()) throw new Error("Tenant ID is required");
    if (!props.userId?.trim()) throw new Error("User ID is required");
  }
}
