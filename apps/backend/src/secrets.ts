import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const ENVIRONMENT = process.env.ENVIRONMENT;
export const PORT = process.env.PORT;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;
export const FRONT_END_ORIGIN = process.env.FRONT_END_ORIGIN!;
