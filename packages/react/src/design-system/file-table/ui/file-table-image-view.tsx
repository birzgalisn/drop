import type { ReactNode } from 'react';
import { useEffect, useEffectEvent } from 'react';

import { Box } from '../../box/feature/box';
import { Modal } from '../../modal/feature/modal';
import { FileTableImageViewCaption } from './file-table-image-view-caption';
import { FileTableImageViewClose } from './file-table-image-view-close';
import { FileTableImageViewDownload } from './file-table-image-view-download';
import { FileTableImageViewNext } from './file-table-image-view-next';
import { FileTableImageViewPrev } from './file-table-image-view-prev';
import { FileTableImageViewStage } from './file-table-image-view-stage';
import { useImageViewContext } from './image-view-context';
import { FileTableImageViewSearch } from './image-view-search-context';

import classes from './file-table-image-view.module.css';

export function FileTableImageView({
  children = (
    <>
      <FileTableImageViewStage />
      <FileTableImageViewPrev />
      <FileTableImageViewNext />
      <FileTableImageViewClose />
      <FileTableImageViewDownload />
      <FileTableImageViewCaption />
    </>
  ),
}: {
  children?: ReactNode;
}) {
  const { active, close } = useImageViewContext();

  if (!active) {
    return null;
  }

  return <FileTableImageViewOpen onClose={close}>{children}</FileTableImageViewOpen>;
}

function FileTableImageViewOpen({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  const { goPrev, goNext } = useImageViewContext();

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const keyHandlerMap: {
      [key: string]: ((event: KeyboardEvent) => void) | undefined;
    } = {
      ArrowLeft: (keyEvent) => {
        keyEvent.preventDefault();
        goPrev();
      },
      ArrowRight: (keyEvent) => {
        keyEvent.preventDefault();
        goNext();
      },
      Escape: (keyEvent) => {
        keyEvent.preventDefault();
        onClose();
      },
    };

    keyHandlerMap[event.key]?.(event);
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Modal onClose={onClose} size="wide">
      <Box pos="relative" tabIndex={-1} className={classes.shell} data-autofocus>
        <Box pos="relative" w="100%" h="min(78vh, 680px)" className={classes.frame}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

FileTableImageView.Search = FileTableImageViewSearch;
FileTableImageView.Stage = FileTableImageViewStage;
FileTableImageView.Prev = FileTableImageViewPrev;
FileTableImageView.Next = FileTableImageViewNext;
FileTableImageView.Close = FileTableImageViewClose;
FileTableImageView.Download = FileTableImageViewDownload;
FileTableImageView.Caption = FileTableImageViewCaption;
FileTableImageView.Caption.Info = FileTableImageViewCaption.Info;
FileTableImageView.Caption.Name = FileTableImageViewCaption.Name;
FileTableImageView.Caption.Date = FileTableImageViewCaption.Date;
