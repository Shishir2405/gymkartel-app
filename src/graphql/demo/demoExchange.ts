import { filter, fromValue, mergeMap, never, pipe, takeUntil, type Source } from "wonka";
import { makeResult, type Exchange, type Operation, type OperationResult } from "urql";
import { Kind, type FieldNode, type OperationDefinitionNode } from "graphql";
import { demoFixtures } from "./fixtures";

/**
 * The demo urql Exchange — the terminal exchange in a demo-mode client.
 *
 * It resolves every operation from `demoFixtures` by the operation's NAME and
 * returns `{ data }` synchronously, with NO network of any kind. It handles all
 * three operation kinds:
 *
 *  - query / mutation: emit one result (the fixture) and complete.
 *  - subscription: stay open forever emitting nothing (a demo has no live feed);
 *    it is torn down cleanly when urql sends the matching teardown.
 *  - teardown: swallowed (there is nothing downstream to forward to).
 *
 * An operation with no fixture never throws: it returns a minimal empty-but-valid
 * shape (each root field → null) and, in __DEV__, warns the missing name. Every
 * operation the app uses has a fixture, so that path is only a safety net.
 */

function operationDefinition(op: Operation): OperationDefinitionNode | undefined {
  const query = op.query;
  // `query` can be a persisted document (no AST) — every operation the app runs
  // is a real DocumentNode, so guard and bail out to the empty fallback if not.
  if (!("definitions" in query)) return undefined;
  return query.definitions.find(
    (d): d is OperationDefinitionNode => d.kind === Kind.OPERATION_DEFINITION,
  );
}

function operationName(op: Operation): string | null {
  return operationDefinition(op)?.name?.value ?? null;
}

/** Root selection field names (respecting aliases) — used only for the fallback. */
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
        // No live feed in a demo: emit nothing, hold open until torn down.
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
