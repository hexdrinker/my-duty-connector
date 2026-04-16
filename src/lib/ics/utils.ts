export function formatDateTimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}`;
}

export function formatDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * RFC 5545: 라인은 75 옥텟을 초과하면 안 됨.
 * 한글 UTF-8은 글자당 3바이트이므로 바이트 단위로 계산.
 */
export function foldLine(line: string): string {
  const MAX_OCTETS = 75;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);

  if (bytes.length <= MAX_OCTETS) {
    return line;
  }

  const lines: string[] = [];
  let offset = 0;

  while (offset < bytes.length) {
    const limit = offset === 0 ? MAX_OCTETS : MAX_OCTETS - 1; // continuation lines start with space
    let end = Math.min(offset + limit, bytes.length);

    // 멀티바이트 문자 중간에서 자르지 않도록 보정
    while (end > offset && isUtf8Continuation(bytes[end])) {
      end--;
    }

    const slice = bytes.slice(offset, end);
    const decoded = new TextDecoder().decode(slice);

    if (offset === 0) {
      lines.push(decoded);
    } else {
      lines.push(" " + decoded);
    }

    offset = end;
  }

  return lines.join("\r\n");
}

function isUtf8Continuation(byte: number | undefined): boolean {
  if (byte === undefined) return false;
  return (byte & 0xc0) === 0x80;
}

export function generateUid(date: string, dutyCode: string): string {
  return `${date}-${dutyCode}@myduty-bridge`;
}
