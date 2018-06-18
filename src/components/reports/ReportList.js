import React from 'react'
import { List, Datagrid, ShowButton, TextField } from 'react-admin'

const ReportList = (props) => (
  <List {...props} title="Reports">
    <Datagrid>
      <TextField source="id" label="ID"/>
      <TextField source="created-at" label="Created at"/>
      <TextField source="address" label="Address"/>
      <TextField source="status" label="Status"/>
      <ShowButton/>
    </Datagrid>
  </List>
)

export default ReportList
