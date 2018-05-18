import React from 'react'
import { List, Datagrid, TextField } from 'react-admin'

export const ReportList = (props) => (
  <List {...props} title="Reports">
    <Datagrid>
      <TextField source="id" label="ID"/>
      <TextField source="created-at" label="Created at"/>
      <TextField source="address" label="Address"/>
      <TextField source="reporter.user.name" label="Reporter name"/>

    </Datagrid>
  </List>
)
