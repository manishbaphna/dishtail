type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

function runtimeEnv(name: string): string | undefined {
  const runtime = globalThis as RuntimeGlobals;
  return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}

/** Constant-time string comparison to avoid leaking the key via timing. */
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Compare lengths in a way that still walks a fixed number of bytes.
  const length = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export type AuthFailure = {
  content: { type: "text"; text: string }[];
  isError: true;
};

/**
 * Validates the `api_key` tool argument against the MCP_API_KEY secret.
 * Returns null when the key is valid, or an MCP error result to return as-is.
 */
export function requireApiKey(apiKey: unknown): AuthFailure | null {
  const expected = runtimeEnv("MCP_API_KEY")?.trim();
  if (!expected) {
    return {
      content: [
        { type: "text", text: "Server misconfiguration: MCP_API_KEY is not set." },
      ],
      isError: true,
    };
  }
  const provided = typeof apiKey === "string" ? apiKey.trim() : "";
  if (!provided || !timingSafeEqual(provided, expected)) {
    return {
      content: [
        { type: "text", text: "Unauthorized: invalid or missing api_key." },
      ],
      isError: true,
    };
  }
  return null;
}

export function lovableApiKey(): string {
  const key = runtimeEnv("LOVABLE_API_KEY")?.trim();
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  return key;
}
