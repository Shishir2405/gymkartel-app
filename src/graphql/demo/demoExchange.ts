import { filter, fromValue, mergeMap, never, pipe, takeUntil, type Source } from "wonka";
import { makeResult, type Exchange, type Operation, type OperationResult } from "urql";
import { Kind, type FieldNode, type OperationDefinitionNode } from "graphql";
import { demoFixtures } from "./fixtures";

function operationDefinition(op: Operation): OperationDefinitionNode | undefined {
  const query = op.query;
  if (!("definitions" in query)) return undefined;
  return query.definitions.find(
    (d): d is OperationDefinitionNode => d.kind === Kind.OPERATION_DEFINITION,
  );
}

function operationName(op: Operation): string | null {
  return operationDefinition(op)?.name?.value ?? null;
}

function rootFieldNames(op: Operation): string[] {
  const def = operationDefinition(op);
  if (!def) return [];
  return def.selectionSet.selections
    .filter((s): s is FieldNode => s.kind === Kind.FIELD)
    .map((s) => s.alias?.value ?? s.name.value);
}

function demoData(op: Operation): Record<string, unknown> {
  const name = operationName(op);
  const resolver = name ? demoFixtures[name] : undefined;
  if (resolver) {
    return resolver((op.variables ?? {}) as Record<string, unknown>);
  }
  if (__DEV__ && name) {
    // eslint-disable-next-line no-console
    console.warn(`[demo] no fixture for operation "${name}" — returning empty shape`);
  }
  const shape: Record<string, unknown> = {};
  for (const field of rootFieldNames(op)) shape[field] = null;
  return shape;
}

export const demoExchange: Exchange = () => (ops$) => {
  const teardown$ = pipe(
    ops$,
    filter((op) => op.kind === "teardown"),
  );

  return pipe(
    ops$,
    filter((op) => op.kind !== "teardown"),
    mergeMap((op) => {
      if (op.kind === "subscription") {
        const open$: Source<OperationResult> = never;
        return pipe(
          open$,
          takeUntil(
            pipe(
              teardown$,
              filter((t) => t.key === op.key),
            ),
          ),
        );
      }
      return fromValue(makeResult(op, { data: demoData(op) }));
    }),
  );
};
