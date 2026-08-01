import path from 'node:path';

import type { CodegenConfig } from '@graphql-codegen/cli';

const configDir = import.meta.dirname;
const reactSrc = path.resolve(configDir, '../react/src');
const schema = path.resolve(configDir, '../../apps/api/src/_generated/schema.graphql');
const reactGraphqlTypes = path.join(reactSrc, '_generated/graphql-types.ts');

const config: CodegenConfig = {
  schema,
  documents: path.join(reactSrc, '**/*.graphql'),
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
      documents: path.join(reactSrc, '**/*.graphql'),
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
};

export default config;
