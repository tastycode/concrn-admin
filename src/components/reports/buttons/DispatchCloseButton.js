import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { showNotification } from "react-admin";
import { push } from "react-router-redux";
import envConfig from "envConfig";

class DispatchCloseButton extends React.Component {
  handleClick = async () => {
    const { push, record, showNotification } = this.props;
    const recordWithUpdate = { ...record, status: "CLOSED" };
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
    showNotification(`Marked Accepted #${record["report-id"]}`);
    push(`/admin/reports/${record["report-id"]}`);
  };
  render() {
    const { record: dispatch } = this.props;
    if (dispatch.report.status === "ARRIVED") {
      return <Button onClick={this.handleClick}>Close</Button>;
    } else {
      return null;
    }
  }
}

export default connect(
  null,
  {
    showNotification,
    push
  }
)(DispatchCloseButton);
