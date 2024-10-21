import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
    url:  import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
    onLoad: 'login-required'
});

export const callLogin = (onAuthenticatedCallback: Function) => {
    keycloak
        .init({ onLoad: "login-required" })
        .then(function (authenticated) {
            authenticated ? onAuthenticatedCallback() : alert("non authenticated");
        })
        .catch((e) => {
            console.dir(e);
            console.log(`keycloak init exception: ${e}`);
        });
};