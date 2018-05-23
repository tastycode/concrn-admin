import React from 'react';
import {
  CreateButton,
  Datagrid,
  DeleteButton,
  EditButton,
  Edit,
  FormTab,
  ReferenceManyField,
  SelectField,
  SimpleForm,
  TabbedForm,
  TextField,
  TextInput,
  required,
  showNotification
} from 'react-admin';

function debug(something) { debugger }

const CreateAffiliateUserButton = props => (
  <CreateButton
    {...props}
    resource="admin/affiliate_users"
    label="Join affiliate"
    to={{
      pathname: '/admin/affiliate_users/create',
      state: {record: {user_id: props.record.id}},
    }}
  />
);

const EditAffiliateUserButton = props => {
  const { userId } = props
  return <EditButton
    resource="admin/affiliate_users"
    to={{
      pathname: '/admin/affiliate_users/create',
      state: {record: {user_id: 5 }},
    }}
  />
}


const UserEditTitle = ({ record }) => <span>Update User: {record.name}</span>
const UserEdit = props => {
  const { id: userId } = props.match.params
  return (
    <Edit {...props} title={<UserEditTitle/>}>
      <TabbedForm>
        <FormTab label="Basics">
          <TextInput source="name" validate={[required()]} />
          <TextInput source="phone" validate={[required()]} />
          <TextInput source="email" validate={[required()]} />
          <TextInput source="password" type="password" validate={[required()]} />
        </FormTab>
        <FormTab label="Affiliates">
          <CreateAffiliateUserButton/>
          <ReferenceManyField
            reference="admin/affiliate_users"
            target="user_id"
            addLabel={false}>
            <Datagrid>
              <TextField source="affiliate.name" />
              <SelectField
                source="role"
                choices={[{id: 'admin', name: 'Admin'}, {id: 'dispatcher', name: 'Dispatcher'}, {id: 'responder', name: 'Responder'}]}
              />
              <EditButton />
              <DeleteButton redirect={`/admin/users/${userId}`}/>
            </Datagrid>
          </ReferenceManyField>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default UserEdit;
