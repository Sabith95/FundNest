import { OAuth2Client } from "google-auth-library";
import { injectable } from "tsyringe";
import { env } from "../config/env";
import {
  GoogleUserPayload,
  IGoogleAuthService,
} from "./interfaces/IGoogleAuthService";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  async verifyIdToken(idToken: string): Promise<GoogleUserPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.name) {
      throw new UnauthorizedError("Invalid google token");
    }
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }
}
