import { DOT_SEPARATOR } from '@repo/react/design-system';

export function documentTitle(page: string) {
  return `${page} ${DOT_SEPARATOR} Drop`;
}

export function routeHead(page: string) {
  return {
    meta: [{ title: documentTitle(page) }],
  };
}
