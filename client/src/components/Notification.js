import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { withStyles } from '@material-ui/core/styles'

import { clearNotification } from 'actions/general'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
    color: '#fff',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: '#fff',
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
  },
  warning: {
    backgroundColor: amber[700],
    color: '#fff',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  )
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent)

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
})

class CustomizedSnackbars extends React.Component {

  handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    this.props.clearNotification()
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.props.notificationShow}
        autoHideDuration={this.props.notificationType==='error' ? null : 3000}
        onClose={this.handleClose}
      >
        <MySnackbarContentWrapper
          onClose={this.handleClose}
          variant={this.props.notificationType}
          message={this.props.notificationMessage}
        />
      </Snackbar>
    )
  }
}


const mapStateToProps = state => ({
  notificationShow: state.general.notificationShow,
  notificationMessage: state.general.notificationMessage,
  notificationType: state.general.notificationType,
})

const mapDispatchToProps = dispatch => ({
  clearNotification: () => dispatch(clearNotification())
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles2)(CustomizedSnackbars))