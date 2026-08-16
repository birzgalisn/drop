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
        <Notifications />
        <ApolloProvider client={apolloClient}>
          <Router />
        </ApolloProvider>
      </UiProvider>
    </StrictMode>,
  );
}

void bootstrap();
