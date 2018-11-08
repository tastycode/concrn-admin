import React from "react";
import {
  BooleanInput,
  Create,
  SimpleForm,
  LongTextInput,
  required
} from "react-admin";

const ReportNoteCreate = props => {
  const reportId =
    props.location.state && props.location.state.record.report_id;
  return (
    <Create {...props} title="Create Report Note">
      <SimpleForm
        redirect={`/admin/reports/${reportId}/show`}
        defaultValue={{
          report_id: reportId
        }}
      >
        <BooleanInput source="notify_reporter" label="Notify Reporter?" />
        <LongTextInput source="notes" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};

export default ReportNoteCreate;
