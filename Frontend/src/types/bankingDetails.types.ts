export interface IUpdateBankDetailsRequest {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
}

export interface IUpdateBankDetailsResponse {
    message: string;
}