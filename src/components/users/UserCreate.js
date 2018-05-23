import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
  required
} from 'react-admin'


const UserCreate = (props) => {
  return <Create {...props} title="Register User">
    <SimpleForm>
      <TextInput source="name" validate={[required()]}/>
      <TextInput source="phone" validate={[required()]}/>
      <TextInput source="email" validate={[required()]}/>
      <TextInput source="password" validate={[required()]}/>
    </SimpleForm>
  </Create>
}

export default UserCreate
