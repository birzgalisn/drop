import { Loader } from '@mantine/core';

import {
  getAppErrorHttpStatus,
  getAppErrorMessage,
} from '../../common/util/get-app-error-field-errors';
import { Box } from '../../design-system/box/feature/box';
import { Center } from '../../design-system/center/feature/center';
import { ErrorScreen } from '../../design-system/error-screen/ui/error-screen';

export function SpaceManageBootLoader() {
  return (
    <Box component="main">
      <Center mih="100vh">
        <Loader />
      </Center>
    </Box>
  );
}

export function SpaceManageBootError({ error, onHome }: { error?: Error; onHome: () => void }) {
  const code = error ? (getAppErrorHttpStatus(error) ?? 500) : 404;
  const message = error ? getAppErrorMessage(error) : 'Space not found or you are not the author.';

  return <ErrorScreen code={code} message={message} action="Go home" onAction={onHome} />;
}
