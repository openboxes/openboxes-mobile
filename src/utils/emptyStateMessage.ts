export type EmptyStateNoun = 'orders' | 'products' | 'shipments' | 'candidates' | 'items' | 'transfers' | 'locations';

export function emptyStateMessage(
  noun: EmptyStateNoun,
  searchTerm: string | undefined | null,
  defaultDescription: string
): string {
  const trimmed = searchTerm?.trim();
  if (trimmed && trimmed.length > 0) {
    return `No ${noun} found for "${trimmed}"`;
  }
  return defaultDescription;
}
