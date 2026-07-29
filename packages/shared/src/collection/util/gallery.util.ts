/** Circular prev/next and lookup for id-keyed lists (lightbox, carousels). */
export class Gallery {
  static item<T extends { id: string }>(
    items: readonly T[],
    id: string | null | undefined,
  ): T | null {
    if (id == null) {
      return null;
    }

    return items.find((item) => item.id === id) ?? null;
  }

  static prevId<T extends { id: string }>(items: readonly T[], id: string | null): string | null {
    if (items.length === 0) {
      return null;
    }

    if (id === null) {
      return items[0]?.id ?? null;
    }

    const index = items.findIndex((item) => item.id === id);

    if (index < 0) {
      return items[0]?.id ?? null;
    }

    return items[(index - 1 + items.length) % items.length]!.id;
  }

  static nextId<T extends { id: string }>(items: readonly T[], id: string | null): string | null {
    if (items.length === 0) {
      return null;
    }

    if (id === null) {
      return items[0]?.id ?? null;
    }

    const index = items.findIndex((item) => item.id === id);

    if (index < 0) {
      return items[0]?.id ?? null;
    }

    return items[(index + 1) % items.length]!.id;
  }
}
