import { getApiBaseUrl } from './get-api-base-url';

export function getGraphqlWsUrl() {
  const httpUrl = `${getApiBaseUrl()}/graphql`;

  return httpUrl.replace(/^http/, 'ws');
}
