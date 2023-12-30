import { useEffect, useState } from 'react';

import { HOSTS, PERMISSIONS } from '~constants/permissions';

export const usePermissionsCheck = () => {
  const [permissionsAccepted, setPermissionsAccepted] = useState<
    undefined | boolean
  >(undefined);

  useEffect(() => {
    chrome?.permissions?.contains(
      {
        permissions: PERMISSIONS,
        origins: HOSTS
      },
      (result) => {
        setPermissionsAccepted(result);
      }
    );
  }, []);

  return permissionsAccepted;
};
