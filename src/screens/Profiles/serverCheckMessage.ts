import { hasExplicitScheme, ResolveResult } from '../../utils/serverUrl';

/** The message the profile dialog shows for a failed server check, or null when it succeeded. */
export function checkErrorMessage(result: ResolveResult, input: string): string | null {
  switch (result.kind) {
    case 'not-openboxes':
      return `No OpenBoxes server found at ${result.tried.join(' or ')}.`;
    case 'unavailable':
      return `The server answered with an error (${result.status}). It may be down or restarting. Try again later.`;
    case 'unreachable':
      return hasExplicitScheme(input)
        ? 'Could not reach the server. Check the address and your connection.'
        : 'Could not reach the server. Check the address and your connection. If the server does not use HTTPS, include http:// in the address.';
    default:
      return null;
  }
}
