import React from 'react';
import {
  Edit,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  required,
  showNotification,
} from 'react-admin';

import * as R from 'ramda'

import {validChoicesForRole} from 'lib/helpers';
import HiddenInput from 'components/HiddenInput';
import withAuthContext from 'components/withAuthContext'


const UserEditTitle = ({record}) => <span>Update User: {record.name}</span>;
const UserEdit = ({auth, ...props}) => {
  const {id: userId} = props.match.params;
  const affiliateAdminInputs = () => (
    <HiddenInput source="affiliate_id" defaultValue={R.path(['affiliate', 'id'], auth)} />
  );
  const adminInputs = (props) => {
    return (
      <ReferenceInput {...props} source="affiliate_id" reference="admin/affiliates" defaultValue={R.path(['affiliate', 'id'], auth)}>
        <SelectInput optionText="name" />
      </ReferenceInput>
    );
  };
  const AffiliateInput = auth.affiliate ? affiliateAdminInputs : adminInputs
  return (
    <Edit {...props} title={<UserEditTitle />}>
      <SimpleForm redirect="list">
        <TextInput source="name" validate={[required()]} />
        <TextInput source="phone" validate={[required()]} />
        <TextInput source="email" validate={[required()]} />
        <TextInput source="password" type="password" validate={[required()]} />
        <AffiliateInput/>
        <SelectInput
            defaultValue="responder"
            source="role"
            label="Role"
            choices={validChoicesForRole(auth.role)}
          />
      </SimpleForm>
    </Edit>
  );
};

export default withAuthContext(UserEdit);
