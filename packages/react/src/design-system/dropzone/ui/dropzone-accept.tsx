import { Dropzone as MantineDropzone } from '@mantine/dropzone';

import { Box } from '../../box/feature/box';
import { Text } from '../../text/feature/text';

import classes from './dropzone.module.css';

export function DropzoneAccept() {
  return (
    <MantineDropzone.Accept>
      <Box className={classes.accept} aria-hidden>
        <Text variant="label">Drop to add</Text>
      </Box>
    </MantineDropzone.Accept>
  );
}
