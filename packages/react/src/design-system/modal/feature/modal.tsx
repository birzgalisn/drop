import { Modal as MantineModal } from '@mantine/core';
import type { ReactNode } from 'react';

import { MODAL_SIZE, type ModalSize } from '../constants/modal-size';

import classes from './modal.module.css';

export type { ModalSize } from '../constants/modal-size';

export type ModalProps = {
  onClose: () => void;
  size?: ModalSize;
  children?: ReactNode;
};

export function Modal({ onClose, size = 'regular', children }: ModalProps) {
  return (
    <MantineModal
      opened
      onClose={onClose}
      centered
      withCloseButton={false}
      size={MODAL_SIZE[size]}
      padding={0}
      radius={0}
      overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
      classNames={{ content: classes.content, body: classes.body }}
    >
      {children}
    </MantineModal>
  );
}
