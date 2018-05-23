import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
  required
} from 'react-admin'


const AffiliateCreate = (props) => {
  return <Create {...props} title="Register Affiliate">
    <SimpleForm>
      <TextInput source="name" validate={[required()]}/>
    </SimpleForm>
  </Create>
}

export default AffiliateCreate
