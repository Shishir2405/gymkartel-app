import type { ComponentType } from "react";

/**
 * Minimal Component Story Format (CSF) types.
 *
 * We keep stories as a lightweight, typed component catalog without pulling the
 * full Storybook runtime into the app bundle. These shims mirror the shapes of
 * `Meta`/`StoryObj` from `@storybook/react` closely enough that swapping in the
 * real runtime later is a drop-in (change the import). Stories double as visual
 * specs for the two polish moments and the token library.
 */
export interface Meta<TProps = Record<string, unknown>> {
  title: string;
  component: ComponentType<TProps>;
  parameters?: Record<string, unknown>;
}

export interface StoryObj<TProps = Record<string, unknown>> {
  name?: string;
  args?: Partial<TProps>;
  render?: (args: TProps) => JSX.Element;
}
