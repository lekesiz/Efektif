// ─── Prompt Injection Protection ─────────────────────────
// Sanitizes user input before inserting into LLM prompts

const DANGEROUS_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now/i,
  /system\s*:\s*/i,
  /\<\/?system\>/i,
  /\<\/?instructions?\>/i,
  /pretend\s+to\s+be/i,
  /act\s+as\s+if/i,
  /forget\s+(everything|all)/i,
  /override\s+(your|the)\s+/i,
  /new\s+instructions/i,
];

/**
 * Sanitize user-provided text before inserting into prompts.
 * Wraps content in XML tags to create clear boundaries.
 */
export function sanitizeForPrompt(input: string, maxLength = 2000): string {
  let sanitized = input.slice(0, maxLength);

  // Remove any XML-like tags that could break prompt structure
  sanitized = sanitized.replace(/<\/?[a-zA-Z][^>]*>/g, "");

  // Flag dangerous patterns (don't remove, just neutralize)
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[filtered]");
  }

  return sanitized.trim();
}

/**
 * Wrap user content in clearly delimited XML tags for the LLM.
 * This creates a clear boundary between system instructions and user data.
 */
export function wrapUserContent(content: string, tag: string): string {
  const sanitized = sanitizeForPrompt(content);
  return `<${tag}>${sanitized}</${tag}>`;
}

/**
 * Sanitize a student name for use in prompts.
 */
export function sanitizeName(name: string): string {
  // Only allow alphanumeric, spaces, hyphens, apostrophes, and common diacritics
  return name
    .replace(/[^\p{L}\p{N}\s\-']/gu, "")
    .slice(0, 100)
    .trim();
}
