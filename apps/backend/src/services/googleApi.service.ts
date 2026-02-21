import { google } from "googleapis";

import { ErrorCode } from "../exceptions";
import { UnauthorizedException } from "@/exceptions/unauthorized";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../secrets";

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "postmessage");

export class GoogleApiService {
  async authenticateUser(code: string) {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.id_token) {
      throw new UnauthorizedException("Google authentication failed", ErrorCode.GOOGLE_API_ERROR);
    }

    const loginTicket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const googleLoginPayload = loginTicket.getPayload();

    return googleLoginPayload;
  }
}

export default new GoogleApiService();
