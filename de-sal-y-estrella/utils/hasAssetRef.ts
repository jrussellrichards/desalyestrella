export function hasAssetRef<T extends { asset?: { _ref?: string } }>(
  img: T
): img is T & { asset: { _ref: string } } {
  return typeof img?.asset?._ref === 'string'
}