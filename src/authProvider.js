import { AUTH_LOGIN, AUTH_ERROR } from 'react-admin'
import authManager from './authManager'
import { mapSingleRecord } from './jsonapi-client/src/restClient'
import envConfig from './envConfig'

export async function login(type, params) {
  switch(type) {
      case AUTH_LOGIN:
        handleLogin(type, params)
        break;
      case AUTH_ERROR:
        throw "AUTH_ERROR"
        break;
  }
}

async function handleLogin(type, params) {
  const { username, password } = params
  const response = await fetch(`${envConfig.CONCRN_API_URL}/tokens`, {
    method: 'POST',
    body: JSON.stringify({
      email: username,
      password
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const loginResponse = await response.json()
  const resolvedLoginResponse = mapSingleRecord(loginResponse, loginResponse.data)
  authManager.write(resolvedLoginResponse)
  return loginResponse
}

export function configureAuth({ callback }) {
  return async (type, params) => {
    const response = await login(type, params)
    response && callback(response)
  }
}
