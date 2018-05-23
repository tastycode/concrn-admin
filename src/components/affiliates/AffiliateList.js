import React from 'react'
import { EditButton, List, Datagrid, TextField} from 'react-admin'

const AffiliateList = (props) => (
  <List {...props} title="Affiliates">
    <Datagrid>
      <TextField source="id" label="ID"/>
      <TextField source="created-at" label="Created at"/>
      <TextField source="name" label="Name"/>
      <EditButton/>
    </Datagrid>
  </List>
)

export default AffiliateList
