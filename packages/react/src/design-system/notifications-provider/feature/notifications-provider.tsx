import { Notifications as MantineNotifications } from '@mantine/notifications';

import classes from './notifications-provider.module.css';

export function NotificationsProvider() {
  return (
    <MantineNotifications
      position="bottom-right"
      containerWidth={360}
      notificationMaxHeight="calc(100dvh - 2rem)"
      classNames={{ root: classes.root }}
    />
  );
}
