const VALIDATION_ERROR = /arguments \[([^\]]*)\]; default message \[([^\]]*)\]/g;

// Grails validation errors arrive as a dump of Spring field errors; keep only their readable default messages.
export function formatServerErrorMessage(message: string): string {
  const readable: string[] = [];
  const pattern = new RegExp(VALIDATION_ERROR);
  let match = pattern.exec(message);
  while (match) {
    const values = match[1].split(',').map((value) => value.trim());
    readable.push(match[2].replace(/\{(\d+)\}/g, (placeholder, index) => values[Number(index)] ?? placeholder));
    match = pattern.exec(message);
  }

  return readable.length > 0 ? readable.join('. ') : message;
}
