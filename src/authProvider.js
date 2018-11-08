import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR } from "react-admin";
import authManager from "./authManager";
import { mapSingleRecord } from "./jsonapi-client/src/restClient";
import envConfig from "./envConfig";

export async function login(type, params) {}

function handleLogout() {
  authManager.clear();
}

async function handleLogin(type, params) {
  const { username, password } = params;
  const response = await fetch(`${envConfig.CONCRN_API_URL}/tokens`, {
    method: "POST",
    body: JSON.stringify({
      email: username,
      password
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  const loginResponse = await response.json();
  const resolvedLoginResponse = mapSingleRecord(
    loginResponse,
    loginResponse.data
  );
  authManager.write(resolvedLoginResponse);
  return loginResponse;
}

export function configureAuth({ callback }) {
  return async (type, params) => {
    switch (type) {
      case AUTH_LOGIN:
        const response = await handleLogin(type, params);
        response && callback(response);
        break;
      case AUTH_LOGOUT:
        return handleLogout();
        break;
      case AUTH_ERROR:
        throw "AUTH_ERROR";
        break;
    }
  };
}
