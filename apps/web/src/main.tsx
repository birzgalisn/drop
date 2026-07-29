import { ApolloProvider } from '@apollo/client/react';
import { Notifications, UiProvider } from '@repo/react/design-system';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { apolloClient } from './apollo-client';
import { Router } from './router';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to mount application');
  }

  void createRoot(container).render(
    <StrictMode>
      <UiProvider>
        <Notifications
          position="bottom-right"
          containerWidth={360}
          /* Upload toast can be tall; Mantine’s default 200px wrapper clips it into the next toast. */
          notificationMaxHeight="calc(100dvh - 2rem)"
        />
        <ApolloProvider client={apolloClient}>
          <Router />
        </ApolloProvider>
      </UiProvider>
    </StrictMode>,
  );
}

void bootstrap();
