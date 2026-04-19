import request from "supertest";
import { expect } from "vitest";

import app from "@/app";
import { signAccessToken } from "@/helpers";

const TEST_USER_ID = 1;
const authCookie = `access_token=${signAccessToken(TEST_USER_ID)}`;

export const authRequest = {
  get: (url: string) => request(app).get(url).set("Cookie", authCookie),
  post: (url: string) => request(app).post(url).set("Cookie", authCookie),
  patch: (url: string) => request(app).patch(url).set("Cookie", authCookie),
  delete: (url: string) => request(app).delete(url).set("Cookie", authCookie),
};

export const expectClearedAuthCookies = (setCookieHeader: string[] | undefined) => {
  const cookies = setCookieHeader ?? [];
  expect(cookies.some((c) => c.startsWith("access_token=;"))).toBe(true);
  expect(cookies.some((c) => c.startsWith("refresh_token=;"))).toBe(true);
};
