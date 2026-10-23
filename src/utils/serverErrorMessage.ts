const VALIDATION_PREFIX = 'Validation error. ';
const VALIDATION_ERROR = /arguments \[([^\]]*)\]; default message \[([^\]]*)\]/g;

// Grails validation errors arrive as a dump of Spring field errors; keep only their readable default messages.
export function formatServerErrorMessage(message: string): string {
  const readable: string[] = [];
  const pattern = new RegExp(VALIDATION_ERROR);
  let match = pattern.exec(message);
  while (match) {
    const values = match[1].split(',').map((value) => value.trim());
    if (match[2] !== 'null') {
      readable.push(match[2].replace(/\{(\d+)\}/g, (placeholder, index) => values[Number(index)] ?? placeholder));
    }
    match = pattern.exec(message);
  }

  if (readable.length > 0) {
    return readable.join('. ');
  }

  // Errors rejected with only a code print "default message [null]", so fall back to the exception's own summary.
  const summaryEnd = message.indexOf(':\n');
  if (message.startsWith(VALIDATION_PREFIX) && summaryEnd > 0) {
    return message.slice(VALIDATION_PREFIX.length, summaryEnd);
  }

  return message;
}
