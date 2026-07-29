/** Immutable helpers for id-set selection (checkboxes, multi-select lists). */
export class Selection {
  static empty(): ReadonlySet<string> {
    return new Set();
  }

  /** Toggle one id in / out of the selection. */
  static toggleOne(selected: ReadonlySet<string>, id: string): ReadonlySet<string> {
    const next = new Set(selected);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    return next;
  }

  /**
   * Select all `selectableIds`, or clear if every selectable id is already selected.
   */
  static toggleAll(
    selected: ReadonlySet<string>,
    selectableIds: readonly string[],
  ): ReadonlySet<string> {
    if (Selection.allSelected(selected, selectableIds)) {
      return Selection.empty();
    }

    return new Set(selectableIds);
  }

  /** Drop ids that are no longer selectable. Returns the same ref when unchanged. */
  static prune(
    selected: ReadonlySet<string>,
    selectableIds: readonly string[],
  ): ReadonlySet<string> {
    const allowed = new Set(selectableIds);

    for (const id of selected) {
      if (!allowed.has(id)) {
        return new Set([...selected].filter((selectedId) => allowed.has(selectedId)));
      }
    }

    return selected;
  }

  static allSelected(selected: ReadonlySet<string>, selectableIds: readonly string[]): boolean {
    return selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));
  }

  static someSelected(selected: ReadonlySet<string>, selectableIds: readonly string[]): boolean {
    return selectableIds.some((id) => selected.has(id));
  }
}
