import type { AnyRegistry } from "../def";
import { isLazyComponent } from "../lazy";
import { getByPath } from "../utils";
import { Wrapper } from "./wrapper";

export type Action = (path: string, args: any) => Promise<any>;

export function createAction(defs: AnyRegistry): Action {
  return async (path: string, args: any) => {
    const modal = getByPath(path, defs._def.record);
    if (!modal) {
      throw new Error(`Modal ${path} not found`);
    }

    const Component = modal._def.component;

    if (isLazyComponent(Component)) {
      const Loaded = await Component.loader();
      return (
        <Wrapper {...args}>
          <Loaded />
        </Wrapper>
      );
    }

    return (
      <Wrapper {...args}>
        <Component />
      </Wrapper>
    );
  };
}
