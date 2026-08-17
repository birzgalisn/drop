export function spaceFileMediaUrl({
  apiBaseUrl,
  scope,
  scopeId,
  fileId,
  variant,
}: {
  apiBaseUrl: string;
  scope: 'spaces' | 'shares';
  scopeId: string;
  fileId: string;
  variant?: 'thumb' | 'preview';
}): string {
  const path = `${apiBaseUrl}/${scope}/${scopeId}/files/${fileId}`;
  return variant ? `${path}?variant=${variant}` : path;
}
