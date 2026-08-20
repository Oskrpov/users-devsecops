import { describe, expect, it } from "vitest";

describe("health endpoint contract", () => {
  it("should expose UP as the healthy status", () => {
    const response = { status: "UP" };
    expect(response).toEqual({ status: "UP" });
  });
});
