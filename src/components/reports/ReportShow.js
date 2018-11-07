import React from "react";
import * as R from "ramda";
import {
  Card,
  CardActions,
  Chip,
  CardContent,
  Typography
} from "@material-ui/core";
import { Button, Link } from "react-admin";
import styled from "styled-components";
import {
  ChipField,
  Datagrid,
  DateField,
  ReferenceField,
  ReferenceManyField,
  Tab,
  TabbedShowLayout,
  Show,
  TextField
} from "react-admin";

import DispatchDismissButton from "./buttons/DispatchDismissButton";
import DispatchAcceptButton from "./buttons/DispatchAcceptButton";
import DispatchArrivedButton from "./buttons/DispatchArrivedButton";
import DispatchCloseButton from "./buttons/DispatchCloseButton";

const ReportTitle = ({ record }) => <span>Report #{record.id}</span>;
const LayoutTest = styled.div`
  background-color: #f0f;
  width: 100%;
`;
const FriendlyEventField = ({ record }) => {
  return (
    {
      REPORT_CREATED: "Initial report",
      RESPONDER_DISPATCH_ATTEMPTED: "Dispatch attempted",
      RESPONDER_DISPATCH_ANSWERED: "Responder answered",
      RESPONDER_DISPATCHED: "Responder accepted",
      REPORTR_NOTE_ADDED: "Note added"
    }[record["event-type"]] || record["event-type"]
  );
};

const DetailsCard = styled(Card)`
  margin: 1em;
`;

const NonDecoratedLink = styled.a`
  text-decoration: none;
`;
const DetailResponderFragment = ({ payload }) => (
  <React.Fragment>
    <Typography color="textSecondary">Responder</Typography>
    <NonDecoratedLink href={`/#/admin/users/${payload["responder-user-id"]}`}>
      <Typography variant="body2">{payload["responder-user-name"]}</Typography>
    </NonDecoratedLink>
    <Typography variant="caption">{payload["responder-user-phone"]}</Typography>
  </React.Fragment>
);

const DetailAffiliateFragment = ({ payload }) => (
  <React.Fragment>
    <Typography color="textSecondary">Affiliate</Typography>
    <NonDecoratedLink href={`/#/admin/affiliates/${payload["affiliate-id"]}`}>
      <Typography variant="body2">{payload["affiliate-name"]}</Typography>
    </NonDecoratedLink>
  </React.Fragment>
);

const DetailsField = ({ record }) => {
  const { payload } = record;
  console.log("Details Field", { record });
  let content;
  if (record["event-type"] === "REPORT_CREATED") {
    content = (
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
          <br />
          <Typography color="textSecondary">Notes</Typography>
          <Typography variant="body1">
            {payload["report-reporter-notes"]}
          </Typography>
        </CardContent>
      </DetailsCard>
    );
  }
  if (record["event-type"] === "RESPONDER_DISPATCH_ATTEMPTED") {
    content = (
      <DetailsCard>
        <CardContent>
          <DetailAffiliateFragment payload={payload} />
          <br />
          <DetailResponderFragment payload={payload} />
          {payload["distance"] && (
            <React.Fragment>
              <br />
              <Typography color="textSecondary">Distance</Typography>
              {payload["distance"]}
            </React.Fragment>
          )}
        </CardContent>
      </DetailsCard>
    );
  }
  if (record["event-type"] === "RESPONDER_DISPATCH_ANSWERED") {
    content = (
      <DetailsCard>
        <CardContent>
          <Chip label={payload["status"]} />
          <br />
          <DetailAffiliateFragment payload={payload} />
          <br />
          <DetailResponderFragment payload={payload} />
        </CardContent>
      </DetailsCard>
    );
  }
  if (record["event-type"] === "RESPONDER_DISPATCHED") {
    content = (
      <DetailsCard>
        <CardContent>
          <DetailAffiliateFragment payload={payload} />
          <br />
          <DetailResponderFragment payload={payload} />
        </CardContent>
      </DetailsCard>
    );
  }
  if (record["event-type"] === "REPORT_NOTE_ADDED") {
    content = (
      <DetailsCard>
        <CardContent>
          {payload["affiliate-name"] && (
            <React.Fragment>
              <Typography color="textSecondary">Affiliate</Typography>
              <Typography variant="body2">
                {payload["affiliate-name"]}
              </Typography>
            </React.Fragment>
          )}
          <Typography color="textSecondary">Created by</Typography>
          <Typography variant="body2">{payload["user-name"]}</Typography>
          <Typography color="textSecondary">Notes</Typography>
          <Typography variant="body1">{payload["notes"]}</Typography>
        </CardContent>
      </DetailsCard>
    );
  }

  // for each high level key, generate a card
  return content || <pre>{JSON.stringify(record.payload, null, 4)}</pre>;
};

const CreateDispatchButton = props => {
  const reportId = R.path(["record", "id"], props);
  return (
    <Button
      component={Link}
      to={{
        pathname: `/dispatches/create`,
        state: {
          record: {
            report_id: reportId
          },
          redirect: `/admin/reports/${reportId}?report_id=${reportId}`
        }
      }}
    >
      Dispatch Responder
    </Button>
  );
};

const CreateNoteButton = props => {
  const reportId = R.path(["record", "id"], props);
  return (
    <Button
      component={Link}
      to={{
        pathname: `/admin/report_notes/create`,
        state: {
          record: {
            report_id: reportId
          },

          redirect: `/admin/reports/${reportId}?report_id=${reportId}`
        }
      }}
    >
      Add Note
    </Button>
  );
};

const ReportShowActions = ({ basePath, data, resource }) => {};

const ReportShow = props => {
  return (
    <Show {...props} title={<ReportTitle />}>
      <TabbedShowLayout>
        <Tab label="Summary">
          <ChipField source="status" label="status" />
          <TextField source="address" label="Address" />
          <DateField source="created-at" label="Date" showTime />
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
          <CreateDispatchButton />
          <CreateNoteButton />
        </Tab>
        <Tab label="Dispatches">
          <ReferenceManyField
            label="Dispatches"
            reference="admin/dispatches"
            target="report_id"
            source="id"
          >
            <Datagrid>
              <DateField showTime source="created-at" label="Date" />
              <ChipField source="dispatch-type" label="Type" />
              <ChipField source="status" label="Status" />
              <TextField source="responder.user.name" label="Responder" />
              <DispatchDismissButton />
              <DispatchAcceptButton />
              <DispatchArrivedButton />
              <DispatchCloseButton />
            </Datagrid>
          </ReferenceManyField>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
export default ReportShow;
