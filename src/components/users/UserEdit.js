import React from "react";
import {
  ArrayInput,
  Button,
  CreateButton,
  DeleteButton,
  FormDataConsumer,
  Datagrid,
  Edit,
  EditButton,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  ReferenceManyField,
  TextField,
  TextInput,
  required,
  showNotification
} from "react-admin";
import { Link } from "react-router-dom";

import * as R from "ramda";

import { validChoicesForRole } from "lib/helpers";
import HiddenInput from "components/HiddenInput";
import withAuthContext from "components/withAuthContext";

const UserEditTitle = ({ record }) => {
  return <span>Update User: {record.name}</span>;
};
const UserEdit = ({ auth, ...props }) => {
  const { id: userId } = props.match.params;
  const affiliateAdminInputs = () => (
    <HiddenInput
      source="affiliate_id"
      defaultValue={R.path(["affiliate", "id"], auth)}
    />
  );
  const adminInputs = props => {
    return (
      <ReferenceInput
        {...props}
        source="affiliate_id"
        reference="admin/affiliates"
        defaultValue={R.path(["affiliate", "id"], auth)}
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    );
  };

  const CreateZipButton = props => {
    return (
      <Button
        component={Link}
        to={{
          pathname: `/admin/zip_fences/create`,
          state: {
            record: {
              fenceable_type: "Responder",
              fenceable_id: R.path(["record", "responder", "id"], props)
            },
            redirect: `/admin/users/${R.path(["record", "id"], props)}`
          }
        }}
      >
        Add Zip
      </Button>
    );
  };

  const EditZipButton = props => {
    return (
      <Button
        component={Link}
        to={{
          pathname: `/admin/zip_fences/${props.record.id}`,
          state: {
            redirect: `/admin/users/${props.record.id}`
          }
        }}
      >
        Edit Zip
      </Button>
    );
  };

  const ZipInputs = ({ record, ...props }) => {
    if (!record.responder) {
      return (
        <div>
          Please save this user to finish converting the user to a responder
        </div>
      );
    }
    record["responder_id"] = record.responder.id;
    return (
      <React.Fragment>
        <ReferenceManyField
          label="Zip Codes"
          filter={{ fenceable_type: "Responder" }}
          reference="admin/zip_fences"
          target="fenceable_id"
          source="responder_id"
          record={record}
          {...props}
        >
          <Datagrid>
            <TextField source="zip" />
            <EditZipButton />
            <DeleteButton redirect={`/admin/users/${record.id}`} />
          </Datagrid>
        </ReferenceManyField>
        <CreateZipButton />
      </React.Fragment>
    );
  };

  const AffiliateInput = auth.affiliate ? affiliateAdminInputs : adminInputs;
  return (
    <Edit {...props} title={<UserEditTitle />}>
      <SimpleForm redirect="list">
        <TextInput source="name" validate={[required()]} />
        <TextInput source="phone" validate={[required()]} />
        <TextInput source="email" validate={[required()]} />
        <TextInput source="password" type="password" />
        <AffiliateInput />
        <SelectInput
          defaultValue="responder"
          source="role"
          label="Role"
          choices={validChoicesForRole(auth.role)}
        />
        <FormDataConsumer>
          {({ formData, ...rest }) => {
            return (
              formData.role === "affiliate_responder" && <ZipInputs {...rest} />
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export default withAuthContext(UserEdit);
