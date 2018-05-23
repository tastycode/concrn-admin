import React from 'react';
import {
  Create,
  ReferenceInput,
  SimpleForm,
  SelectInput,
  TextInput,
  required,
} from 'react-admin';

import {validChoicesForRole} from 'lib/helpers';
import AuthContext from 'components/AuthContext';
import HiddenInput from 'components/HiddenInput';

const UserCreate = props => {
  const affiliateAdminInputs = affiliate => (
    <HiddenInput source="affiliate_id" defaultValue={affiliate.id} />
  );
  const adminInputs = () => {
    return (
      <ReferenceInput source="affiliate_id" reference="admin/affiliates">
        <SelectInput optionText="name" />
      </ReferenceInput>
    );
  };
  return (
    <Create {...props} title="Register User">
      <SimpleForm redirect="list">
        <TextInput source="name" validate={[required()]} />
        <TextInput source="phone" validate={[required()]} />
        <TextInput source="email" validate={[required()]} />
        <TextInput source="password" type="password" validate={[required()]} />
        <AuthContext.Consumer>
          {auth =>
            auth.affiliate
              ? affiliateAdminInputs(auth.affiliate)
              : adminInputs()
          }
        </AuthContext.Consumer>
        <AuthContext.Consumer>
          {auth => {
            return <SelectInput
              defaultValue="responder"
              source="role"
              label="Role"
              choices={validChoicesForRole(auth.role)}
            />
            }
          }
        </AuthContext.Consumer>
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
