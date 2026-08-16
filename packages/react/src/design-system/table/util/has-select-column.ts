export function hasSelectColumn(columns: ReadonlyArray<{ id?: string }>): boolean {
  return columns.some((column) => column.id === 'select');
}
