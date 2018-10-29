import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = () => {
  return (
    <div>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          No Active Internet Connection Detected
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can continue with your work once the connection is back. 
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AlertDialog;
