type QueryValue = string | readonly string[] | undefined;
type QueryParams = Record<string, QueryValue>;

export class Urls {
  static query(params: QueryParams): string {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      const serialized = [value].flat().join(',');
      if (serialized) {
        search.set(key, serialized);
      }
    }

    const query = search.toString();
    return query ? `?${query}` : '';
  }

  static open({ url, query = {} }: { url: string; query?: QueryParams }): void {
    window.location.assign(`${url}${Urls.query(query)}`);
  }
}
