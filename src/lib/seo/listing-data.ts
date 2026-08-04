/**
 * Merge SSR loader listings with React Query results.
 *
 * `placeholderData: []` makes empty arrays look "ready" during SSR, and a
 * successful client fetch can also return [] while loader data still has items.
 * Always prefer a non-empty list when either source has content.
 */
export function preferListingData<T>(
  loaderItems: T[] | undefined,
  queryItems: T[] | undefined,
): T[] {
  const loader = loaderItems ?? [];
  const query = queryItems ?? [];
  if (query.length > 0) return query;
  if (loader.length > 0) return loader;
  return query;
}
