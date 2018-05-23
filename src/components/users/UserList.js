import React from 'react'
import { EditButton, List, Datagrid, TextField} from 'react-admin'

const UserList = (props) => (
  <List {...props} title="Users">
    <Datagrid>
      <TextField source="id" label="ID"/>
      <TextField source="created-at" label="Created at"/>
      <TextField source="name" label="Name"/>
      <TextField source="phone" label="Phone"/>
      <TextField source="email" label="Email"/>
      <EditButton/>
    </Datagrid>
  </List>
)

export default UserList
