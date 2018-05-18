import { AUTH_LOGIN } from 'react-admin'

export default async (type, params) => {
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
    const { jwt: token } = await response.json()
    localStorage.setItem('token', token)
  }
}
