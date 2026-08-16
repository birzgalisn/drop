import { Notifications as MantineNotifications } from '@mantine/notifications';

import '@mantine/notifications/styles.css';
import classes from './notifications.module.css';

export function Notifications() {
  return (
    <MantineNotifications
      position="bottom-right"
      containerWidth={360}
      notificationMaxHeight="calc(100dvh - 2rem)"
      classNames={{ root: classes.root }}
    />
  );
}
