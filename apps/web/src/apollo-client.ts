import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

import { getGraphqlHttpUrl } from './shared/util/get-graphql-http-url';
import { getGraphqlWsUrl } from './shared/util/get-graphql-ws-url';

const httpLink = new HttpLink({
  uri: getGraphqlHttpUrl(),
  credentials: 'include',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: getGraphqlWsUrl(),
  }),
);

const link = ApolloLink.split(
  ({ operationType }) => operationType === OperationTypeNode.SUBSCRIPTION,
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Space: {
        fields: {
          // Authoritative list from the server — replace is intentional (e.g. last file removed).
          files: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
