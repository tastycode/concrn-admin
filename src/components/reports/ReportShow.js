import React from 'react'
import { ChipField, SimpleShowLayout, Show, TextField } from 'react-admin'

import styled from 'styled-components'

const ReportTitle = ({record}) => <span>Report #{record.id}</span>;
const LayoutTest  = styled.div`
  background-color: #f0f;
  width: 100%;
`
const ReportShow = (props) => {
  return <Show {...props} title={<ReportTitle/>}>
    <SimpleShowLayout>
      <ChipField source="status" label="status"/>
      <TextField source="address" label="Address"/>
      <TextField source="created-at" label="Date"/>
      <Show resource="admin/users"  match={{params: {id: 1}}} location={{pathname: "/admin/users/1/show"}}>
        <TextField source="name"/>
      </Show>
    </SimpleShowLayout>
  </Show>

}
export default ReportShow
