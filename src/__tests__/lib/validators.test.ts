import { describe, it, expect } from "vitest";
import { validateMyDutyUrl } from "@/lib/validators";

describe("validateMyDutyUrl", () => {
  it("accepts valid myduty share links", () => {
    const result = validateMyDutyUrl("https://myduty.io/s/9283005842203529");
    expect(result.valid).toBe(true);
    expect(result.shareId).toBe("9283005842203529");
  });

  it("accepts http links", () => {
    const result = validateMyDutyUrl("http://myduty.io/s/1234567890");
    expect(result.valid).toBe(true);
    expect(result.shareId).toBe("1234567890");
  });

  it("accepts links with trailing slash", () => {
    const result = validateMyDutyUrl("https://myduty.io/s/9283005842203529/");
    expect(result.valid).toBe(true);
  });

  it("trims whitespace", () => {
    const result = validateMyDutyUrl(
      "  https://myduty.io/s/9283005842203529  ",
    );
    expect(result.valid).toBe(true);
  });

  it("rejects empty input", () => {
    const result = validateMyDutyUrl("");
    expect(result.valid).toBe(false);
  });

  it("rejects non-myduty URLs", () => {
    const result = validateMyDutyUrl("https://google.com");
    expect(result.valid).toBe(false);
  });

  it("rejects myduty URLs without share path", () => {
    const result = validateMyDutyUrl("https://myduty.io/dashboard");
    expect(result.valid).toBe(false);
  });

  it("rejects share IDs with non-numeric characters", () => {
    const result = validateMyDutyUrl("https://myduty.io/s/abc123");
    expect(result.valid).toBe(false);
  });
});
