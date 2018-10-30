import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FlatButton from '@material-ui/core/FlatButton'
import { showNotification } from 'react-admin'
import { push } from 'react-router-redux'

class ApproveButton extends React.Component {
  handleClick = () => {
    const { push, record, showNotification } = this.props
  }
}

export default connect(null, {
  showNotification,
  push
})(ApproveButton)
