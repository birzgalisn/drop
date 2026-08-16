export const MODAL_SIZE = {
  narrow: '25rem',
  regular: '40rem',
  wide: '60rem',
} as const;

export type ModalSize = keyof typeof MODAL_SIZE;
