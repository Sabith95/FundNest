export interface GoogleUserPayload {
    googleId: string
    email: string
    name: string
    picture?: string
}

export interface IGoogleAuthService {
    verifyIdToken(idToken: string): Promise<GoogleUserPayload>
}