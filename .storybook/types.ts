import type { ComponentType } from "react";

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
