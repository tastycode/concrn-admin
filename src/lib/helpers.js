import { USER_ROLE_CHOICES } from './constants'
export const labelForRole = (role) => {
  const foundRoleChoice = USER_ROLE_CHOICES.find( choice => choice.id === role )
  return foundRoleChoice && foundRoleChoice.name
}

export const validChoicesForRole = (role) => {
  for (let i = 0; i < USER_ROLE_CHOICES.length ; i++) {
    let choice = USER_ROLE_CHOICES[i]
    if (role === choice.id) {
      let result = USER_ROLE_CHOICES.slice(i)
      console.log('validChoicesForRole', result)
      return result
    }
  }
}

