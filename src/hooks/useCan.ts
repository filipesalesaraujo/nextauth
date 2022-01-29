import { AuthContext } from "./../contexts/AuthContext";
import { useContext } from "react";
import { validateUserpermissions } from "../utils/validateUserPermissions";
type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return false;
  }
  const userHasValidPermissions = validateUserpermissions({
    user,
    permissions,
    roles,
  });
  return userHasValidPermissions;
}
