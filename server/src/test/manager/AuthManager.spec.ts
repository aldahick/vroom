import { expect } from "chai";
import { AuthManager } from "../../manager";
import { User } from "../../model";

describe("AuthManager", () => {
  const authManager = new AuthManager();
  describe("#hashPassword()", () => {
    it("should hash a password to something different than the input", async () => {
      expect(await authManager.hashPassword("foo")).to.not.equal("foo");
    });
  });
  describe("#isLoginValid()", () => {
    it("should return correctly for base case", async () => {
      expect(await authManager.isLoginValid(new User({
        password: await authManager.hashPassword("foo")
      }), "foo")).to.equal(true);
    });
  });
});
