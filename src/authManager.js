export const write = (authData) => {
  localStorage.setItem('auth', JSON.stringify(authData))
}

export const read = () => {
  const storedAuth = localStorage.getItem('auth')
  return storedAuth && JSON.parse(storedAuth)
}

export const clear = () => {
  localStorage.removeItem('auth')
}

export default {
  clear,
  read,
  write
}
