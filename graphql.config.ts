import { type IGraphQLConfig } from 'graphql-config';

const schema = 'apps/api/src/_generated/schema.graphql';
const reactSrc = 'packages/react/src';
const reactGraphqlTypes = 'packages/react/src/_generated/graphql-types.ts';

export default {
  schema,
  documents: `${reactSrc}/**/*.graphql`,
  extensions: {
    codegen: {
      ignoreNoDocuments: true,
      generates: {
        [reactGraphqlTypes]: {
          schema,
          plugins: ['typescript'],
          config: {
            skipTypename: false,
          },
        },
        [`${reactSrc}/`]: {
          schema,
          documents: `${reactSrc}/**/*.graphql`,
          preset: 'near-operation-file',
          presetConfig: {
            baseTypesPath: '_generated/graphql-types.ts',
            extension: '.generated.ts',
          },
          plugins: ['typescript-operations', 'typed-document-node'],
          config: {
            skipTypename: false,
            enumsAsConst: true,
          },
        },
      },
    },
  },
} as const satisfies IGraphQLConfig;
