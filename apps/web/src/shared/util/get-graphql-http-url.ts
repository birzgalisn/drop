import { getApiBaseUrl } from './get-api-base-url';

export function getGraphqlHttpUrl() {
  return `${getApiBaseUrl()}/graphql`;
}
