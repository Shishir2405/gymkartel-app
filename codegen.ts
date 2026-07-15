import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Points at the built contract's GraphQL SDL (the wire source of truth).
 * Operation documents are co-located per feature as .graphql files; output is a
 * single typed module of urql React hooks. Runs fully offline against the local
 * schema file — no server required.
 */
const config: CodegenConfig = {
  schema: "../gymkartel-backend/packages/contracts/src/schema.graphql",
  documents: ["src/graphql/operations/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "src/graphql/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-urql",
      ],
      config: {
        scalars: { DateTime: "string", ID: "string" },
        withHooks: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
          defaultValue: false,
        },
        skipTypename: false,
        enumsAsTypes: false,
        strictScalars: true,
      },
    },
  },
};

export default config;
