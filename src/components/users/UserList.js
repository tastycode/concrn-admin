import React from 'react';
import {EditButton, List, Datagrid, TextField} from 'react-admin';
import {labelForRole} from 'lib/helpers';
import withAuthContext from 'components/withAuthContext';

const RoleField = ({record}) => <span>{labelForRole(record.role)}</span>;
const UserList = ({auth, ...props}) => {
  return (
    <List {...props} title="Users">
      <Datagrid>
        <TextField source="id" label="ID" />
        <TextField source="created-at" label="Created at" />
        <TextField source="name" label="Name" />
        <TextField source="phone" label="Phone" />
        <TextField source="email" label="Email" />
        {!auth.isAffiliate && <TextField source="affiliate.name" label="Affiliate" />}
        <RoleField label="Role" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default withAuthContext(UserList);
