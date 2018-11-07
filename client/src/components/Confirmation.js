import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.confirmationCancel}
      aria-labelledby="Confirmation"
      aria-describedby="Confirmation"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="alert-dialog-title">{"Please Confirm"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.confirmationCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={props.confirmationProceed} color="secondary" autoFocus disabled={props.disabled}>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
