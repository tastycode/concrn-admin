import React from 'react'
import {
  Create,
  Edit,
  SimpleForm,
  TextInput,
  required
} from 'react-admin'

const CommonFields = (props) => {

  return <SimpleForm {...props}
      redirect={props.location.state.redirect}
      defaultValue={{
        ...(props.location.state ? props.location.state.record : {})
      }}>
    <TextInput source="zip" validate={[required()]}/>
  </SimpleForm>
}

const ZipFenceCreate = (props) => {
  return <Create {...props} title="Add Zip Code">
    <CommonFields {...props}/>
  </Create>
}

const ZipFenceEdit = (props) => {
  return <Edit {...props} title="Change Zip Code">
    <CommonFields {...props}/>
  </Edit>
}

export {
  ZipFenceCreate,
  ZipFenceEdit
}
