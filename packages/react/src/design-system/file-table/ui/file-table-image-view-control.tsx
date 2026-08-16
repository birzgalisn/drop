import clsx from 'clsx';
import type { ReactNode } from 'react';

import { Box } from '../../box/feature/box';
import { IconButton } from '../../icon-button/feature/icon-button';

import classes from './file-table-image-view.module.css';

type FileTableImageViewControlProps = {
  placement: 'prev' | 'next' | 'close' | 'download';
  'aria-label': string;
  children: ReactNode;
} & ({ onClick: () => void; href?: never } | { href: string; onClick?: never });

export function FileTableImageViewControl(props: FileTableImageViewControlProps) {
  const { placement, 'aria-label': ariaLabel, children } = props;

  return (
    <Box pos="absolute" className={clsx(classes.control, classes[placement])}>
      {isLink(props) ? (
        <IconButton href={props.href} variant="ghost" aria-label={ariaLabel}>
          {children}
        </IconButton>
      ) : (
        <IconButton onClick={props.onClick} variant="ghost" aria-label={ariaLabel}>
          {children}
        </IconButton>
      )}
    </Box>
  );
}

function isLink(
  props: FileTableImageViewControlProps,
): props is Extract<FileTableImageViewControlProps, { href: string }> {
  return 'href' in props && typeof props.href === 'string';
}
