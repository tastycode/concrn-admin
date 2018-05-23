import React from 'react';
import {
  Create,
  ReferenceInput,
  SimpleForm,
  SelectInput,
  required,
} from 'react-admin';

import { AFFILIATE_USER_ROLE_CHOICES } from '../../constants'

const AffiliateUserCreate = props => {
  const user_id = props.location.state.record['user_id']
  return (
    <Create {...props} title="Join Affiliate">
      <SimpleForm redirect={`/admin/users/${user_id}`}>
        <ReferenceInput
          source="user_id"
          defaultValue={props.location.state.record.user_id}
          reference="admin/users"
          validate={[required()]}>
          <SelectInput optionText="email"/>
        </ReferenceInput>
        <SelectInput
          defaultValue="responder"
          source="role"
          choices={AFFILIATE_USER_ROLE_CHOICES}
        />
        <ReferenceInput
          label="Affiliate"
          source="affiliate_id"
          reference="admin/affiliates">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

export default AffiliateUserCreate;
