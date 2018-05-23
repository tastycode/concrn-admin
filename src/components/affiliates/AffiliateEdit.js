import React from 'react'
import {
  Edit,
  SimpleForm,
  TextInput,
  required
} from 'react-admin'



const AffiliateEdit = (props) => {
  return <Edit {...props} title="Update Affiliate">
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
    </SimpleForm>
  </Edit>
}

export default AffiliateEdit
