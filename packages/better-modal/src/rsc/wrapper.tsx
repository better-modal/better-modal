import type { ReactElement } from "react";
import { cloneElement } from "react";

export function Wrapper<T = unknown>({
  children,
  ...props
}: T & { children: ReactElement }) {
  return cloneElement(children, props);
}
