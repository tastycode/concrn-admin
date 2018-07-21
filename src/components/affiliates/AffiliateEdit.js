import React from "react";
import {
  Button,
  Datagrid,
  DeleteButton,
  Edit,
  Link,
  ReferenceManyField,
  SimpleForm,
  TextInput,
  TextField,
  required
} from "react-admin";

import * as R from "ramda";

const CreateZipButton = props => {
  return (
    <Button
      component={Link}
      to={{
        pathname: `/admin/zip_fences/create`,
        state: {
          record: {
            fenceable_type: "Affiliate",
            fenceable_id: R.path(["record", "id"], props)
          },
          redirect: `/admin/affiliates/${R.path(["record", "id"], props)}`
        }
      }}
    >
      Add Zip
    </Button>
  );
};

const EditZipButton = ({ parentRecord, record, ...props }) => {
  return (
    <Button
      component={Link}
      to={{
        pathname: `/admin/zip_fences/${record.id}`,
        state: {
          record: {
            fenceable_type: "Affiliate",
            fenceable_id: R.path(["id"], parentRecord)
          },
          redirect: `/admin/affiliates/${parentRecord.id}`
        }
      }}
    >
      Edit Zip
    </Button>
  );
};

const ZipInputs = ({ record, ...props }) => {
  return (
    <React.Fragment>
      <ReferenceManyField
        label="Zip Codes"
        filter={{ fenceable_type: "Affiliate" }}
        reference="admin/zip_fences"
        target="fenceable_id"
        source="id"
        record={record}
        {...props}
      >
        <Datagrid>
          <TextField source="zip" />
          <EditZipButton parentRecord={record} />
          <DeleteButton redirect={`/admin/affiliates/${record.id}`} />
        </Datagrid>
      </ReferenceManyField>
      <CreateZipButton record={record} />
    </React.Fragment>
  );
};

const AffiliateEdit = props => {
  return (
    <Edit {...props} title="Update Affiliate">
      <SimpleForm>
        <TextInput source="name" validate={[required()]} />
        <ZipInputs />
      </SimpleForm>
    </Edit>
  );
};

export default AffiliateEdit;
