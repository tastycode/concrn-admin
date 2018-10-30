import React from "react";
import {
  AutocompleteInput,
  Create,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required
} from "react-admin";
import * as R from "ramda";

const ResponderOptionRenderer = user =>
  `${user.name}${
    R.path(["responder", "available"], user) ? " - 🔆 Available" : ""
  }`;
export default function DispatchCreate(props) {
  const reportId = props.location.state && props.location.state.record.report_id
  return (
    <Create {...props}>
      <SimpleForm
        redirect={`/admin/reports/${reportId}/show`}
        defaultValue={{
          report_id: reportId
        }}
      >
        <ReferenceInput
          label="Responder"
          source="responder_user_id"
          reference="admin/users"
          filterToQuery={searchText => ({
            q: searchText,
            responder: { available: true }
          })}
        >
          <AutocompleteInput
            optionText={ResponderOptionRenderer}
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
}
