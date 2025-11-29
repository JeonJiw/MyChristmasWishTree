import { ShareService } from "../services/shareService";

describe("ShareService", () => {
  test("generateShareId returns a non-empty string", () => {
    const id = ShareService.generateShareId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  test("createShareURL builds a URL using window.location.origin", () => {
    const id = "abc123";
    const url = ShareService.createShareURL(id);

    expect(url).toBe(`${window.location.origin}/#/tree/${id}`);
  });

  test("copyToClipboard uses navigator.clipboard when available", async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    const text = "hello world";
    const result = await ShareService.copyToClipboard(text);

    expect(writeTextMock).toHaveBeenCalledWith(text);
    expect(result).toBe(true);
  });
});
