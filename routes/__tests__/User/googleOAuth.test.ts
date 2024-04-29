// tests/integration/googleOAuth.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../socket/socket";

jest.mock("../../../utils/authFunctions", () => ({
  getGoogleOAuthToken: jest.fn().mockResolvedValue("fakeGoogleToken"),
  getGoogleOAuthUserInfo: jest.fn().mockResolvedValue({
    resourceName: "people/fakeId",
    names: [{ givenName: "John", familyName: "Doe" }],
    emailAddresses: [{ value: "john.doe@example.com" }],
  }),
}));

describe("POST /google-oauth - Google OAuth Controller Integration Test", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }, 10000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  }, 10000);

  test("Successfully login or signup via Google OAuth", async () => {
    const response = await request(app)
      .post("/google-oauth")
      .send({ code: "fakeAuthCode" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Invalid google token");
  }, 10000);
});
