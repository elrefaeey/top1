const RETRY_DELAY_MS = 600;

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && /fetch|network|load failed/i.test(error.message);
}

/**
 * For route loaders during client navigation: when the browser cannot reach the server
 * (offline / dropped connection), retry once and then resolve `undefined` instead of
 * throwing, so the page renders from its own data hooks rather than the root error screen.
 * SSR and non-network errors (notFound, redirect, 5xx) pass through unchanged.
 */
export async function clientNetworkFallback<T>(load: () => Promise<T>): Promise<T | undefined> {
  if (import.meta.env.SSR) return load();
  try {
    return await load();
  } catch (error) {
    if (!isNetworkError(error)) throw error;
  }
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  try {
    return await load();
  } catch (error) {
    if (!isNetworkError(error)) throw error;
    return undefined;
  }
}
