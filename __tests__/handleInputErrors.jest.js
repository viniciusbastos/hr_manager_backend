import { handleInputErrors } from "../src/handlers/validation"; // Assuming this is the path to your handler file

describe("Handle Input Errors", () => {
  it("should return an error if any validation errors are present", async () => {
    const req = {
      body: {
        field1: "invalid value"
      }
    };
    const res = {};
    const next = jest.fn();

    await handleInputErrors(req, res, next);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([{ field1: ["ValidationError", "Invalid data"] }]);
  });

  it("should proceed to the next middleware if no validation errors are present", async () => {
    const req = {
      body: {}
    };
    const res = {};
    const next = jest.fn();

    await handleInputErrors(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});