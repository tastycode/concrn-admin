import { AUTH_LOGIN } from 'react-admin'
import authManager from './authManager'
import { mapSingleRecord } from './jsonapi-client/src/restClient'

export async function login(type, params) {
  if (type === AUTH_LOGIN) {
    const { username, password } = params
    const response = await fetch('http://localhost:3000/tokens', {
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
}

export function configureAuth({ callback }) {
  return async (type, params) => {
    const response = await login(type, params)
    response && callback(response)
  }
}
