import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}
export function Can({ children, permissions, roles }: CanProps) {
  const userCamSeeComponent = useCan({ permissions, roles });
  if (!userCamSeeComponent) {
    return null;
  }
  return <>{children}</>;
}
