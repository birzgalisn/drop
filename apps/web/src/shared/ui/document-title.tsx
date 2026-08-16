import { documentTitle } from '../util/route-head';

export function DocumentTitle({ page }: { page: string }) {
  return <title>{documentTitle(page)}</title>;
}
