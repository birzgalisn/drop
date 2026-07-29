/** The single shared tus endpoint for every upload type (see API `TusConfig.PATH`). */
export function getFilesTusEndpoint(options: { apiBaseUrl: string }): string {
  return `${options.apiBaseUrl.replace(/\/$/, '')}/files`;
}
