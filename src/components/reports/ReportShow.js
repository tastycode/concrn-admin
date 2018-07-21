import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import styled from "styled-components";
import {
  ChipField,
  Datagrid,
  DateField,
  ReferenceManyField,
  SimpleShowLayout,
  Show,
  TextField
} from "react-admin";

const ReportTitle = ({ record }) => <span>Report #{record.id}</span>;
const LayoutTest = styled.div`
  background-color: #f0f;
  width: 100%;
`;
const FriendlyEventField = ({ record }) => {
  return (
    {
      REPORT_CREATED: "Initial report",
      RESPONDER_DISPATCH_ATTEMPTED: "Dispatch attempted"
    }[record["event-type"]] || record["event-type"]
  );
};

const DetailsCard = styled(Card)`
  margin: 1em;
`;

const NonDecoratedLink = styled.a`
  text-decoration: none;
`

const DetailsField = ({ record }) => {
  const { payload } = record;
  if (record["event-type"] === "REPORT_CREATED") {
    const content = (
      <DetailsCard>
        <CardContent>
          <Typography color="textSecondary">Reported by</Typography>
          <Typography variant="body2">
            {payload["reporter-user-name"]}
          </Typography>
          <NonDecoratedLink href={`tel:${payload["reporter-user-phone"]}`}>
            <Typography variant="caption">
              {payload["reporter-user-phone"]}
            </Typography>
          </NonDecoratedLink>
          <br/>
          <Typography color="textSecondary">Notes</Typography>
          <Typography variant="body1">
            {payload["report-reporter-notes"]}
          </Typography>
        </CardContent>
      </DetailsCard>
    );
    return content;
  }
  if (record["event-type"] === "RESPONDER_DISPATCH_ATTEMPTED") {
    const content = (
      <DetailsCard>
        <CardContent>
          <Typography color="textSecondary">Affiliate</Typography>
          <NonDecoratedLink href={`/#/admin/affiliates/${payload["affiliate-id"]}`}>
            <Typography variant="body2">{payload["affiliate-name"]}</Typography>
          </NonDecoratedLink>
          <br/>
          <Typography color="textSecondary">Responder</Typography>
          <NonDecoratedLink href={`/#/admin/users/${payload["responder-user-id"]}`}>
            <Typography variant="body2">
              {payload["responder-user-name"]}
            </Typography>
          </NonDecoratedLink>
          <Typography variant="caption">
            {payload["responder-user-phone"]}
          </Typography>
          {payload["distance"] && <React.Fragment>
            <br/>
            <Typography color="textSecondary">Distance</Typography>
            {payload["distance"]}
          </React.Fragment>}
        </CardContent>
      </DetailsCard>
    );
    return content;
  }

  // for each high level key, generate a card
  return <pre>{JSON.stringify(record.payload, null, 4)}</pre>;
};

const ReportShow = props => {
  return (
    <Show {...props} title={<ReportTitle />}>
      <SimpleShowLayout>
        <ChipField source="status" label="status" />
        <TextField source="address" label="Address" />
        <DateField source="created-at" label="Date" showTime/>
        <ReferenceManyField
          label="History"
          reference="admin/report_events"
          target="report_id"
          source="id"
        >
          <Datagrid>
            <DateField showTime source="created-at" label="Date" />
            <FriendlyEventField source="event-type" label="Event" />
            <DetailsField source="payload" label="Details" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
export default ReportShow;
