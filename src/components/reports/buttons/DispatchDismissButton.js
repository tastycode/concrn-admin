import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { showNotification } from "react-admin";
import { push } from "react-router-redux";
import envConfig from "envConfig";

class DispatchDismissButton extends React.Component {
  handleClick = async () => {
    const { push, record, showNotification } = this.props;
    const recordWithUpdate = { ...record, status: "DISMISSED" };
    const updatedDispatch = await fetch(
      `${envConfig.CONCRN_API_URL}/dispatches/${record.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            attributes: recordWithUpdate
          }
        })
      }
    );
    showNotification(`Dismissed Report #${record["report-id"]}`);
    push(`/admin/reports/${record["report-id"]}`);
  };
  render() {
    const { record: dispatch } = this.props;
    if (dispatch.report.status === "NEW") {
      return <Button onClick={this.handleClick}>Dismiss</Button>;
    } else {
      return null
    }
  }
}

export default connect(
  null,
  {
    showNotification,
    push
  }
)(DispatchDismissButton);
