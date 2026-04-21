export function emptyStateMessage(
  noun: string,
  searchTerm: string | undefined | null,
  defaultDescription: string
): string {
  const trimmed = searchTerm?.trim();
  if (trimmed && trimmed.length > 0) {
    return `No ${noun} found for "${trimmed}"`;
  }
  return defaultDescription;
}
