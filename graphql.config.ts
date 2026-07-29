import type { IGraphQLConfig } from 'graphql-config';

const schema = 'apps/api/src/_generated/schema.graphql';
const reactDocuments = 'packages/react/src/**/*.graphql';

export default {
  schema,
  documents: reactDocuments,
} as const satisfies IGraphQLConfig;
