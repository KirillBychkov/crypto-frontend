import { useCallback, useEffect, useState } from "react";
import { keycloak } from './KeycloakService';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (keycloak.authenticated) {
      (async() => {
        try {
          const userProfile = await keycloak.loadUserProfile();

          setUser({ ...userProfile, fullName: `${userProfile.firstName} ${userProfile.lastName}` });
        } catch (err) {
          console.log('err', err);
        }
      })();
    }
  }, [keycloak.authenticated]);

  return {
    isAuthenticated: !!keycloak.authenticated,
    initialized: !!keycloak,
    meta: { keycloak },
    token: keycloak.token,
    refreshToken: keycloak.refreshToken,
    user,
    roles: keycloak.realmAccess,
    login: useCallback(async () => {
      await keycloak.login();
    }, [keycloak]),
    logout: useCallback(async () => {
      await keycloak.logout();
    }, [keycloak]),
    register: useCallback(async () => {
      await keycloak.register();
    }, [keycloak]),
    updateToken: useCallback(async (cb) => {
      const data = await keycloak.updateToken(5);
      return cb(data);
    }, [keycloak]),
  };
};

export default { useAuth };
