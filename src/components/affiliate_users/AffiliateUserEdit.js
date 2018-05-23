import React from 'react';
import {
  Edit,
  ReferenceInput,
  SimpleForm,
  SelectInput,
  required,
} from 'react-admin';

const UserEditForm = (props) => {
  return <SimpleForm {...props} redirect={`/admin/users/${props.record.user_id}`} title={`${props.record.affiliate.name} User Profile: ${props.record.user.name}`}/>
}
const AffiliateUserTitle = ({ record }) => {
  return <span>Membership: {record.user.name} @ {record.affiliate.name}</span>
};

const AffiliateUserEdit = props => {
  return (
    <Edit {...props} title={<AffiliateUserTitle/>}>
      <UserEditForm>
        <ReferenceInput
          source="user_id"
          reference="admin/users"
          validate={[required()]}>
          <SelectInput optionText="email"/>
        </ReferenceInput>
        <SelectInput
          defaultValue="responder"
          source="role"
          choices={[
            {id: 'admin', name: 'Admin'},
            {id: 'dispatcher', name: 'Dispatcher'},
            {id: 'responder', name: 'Responder'},
          ]}
        />
        <ReferenceInput
          label="Affiliate"
          source="affiliate_id"
          reference="admin/affiliates">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </UserEditForm>
    </Edit>
  );
};

export default AffiliateUserEdit;
