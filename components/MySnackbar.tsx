import { Alert, AlertColor, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

type MySnackbarProps = {
  message: string;
  resetMessage: () => void;
  type: AlertColor;
}

export default function MySnackbar({ message, resetMessage, type}: MySnackbarProps): JSX.Element {
  const [open, setOpen] = useState(false);

  React.useMemo(() => {
    if(message !== '') {
      setOpen(true)
    }
  }, [message]);
  
  const handleClose = React.useCallback(() => {
    setOpen(false);
    resetMessage();
  }, [resetMessage]);

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        { message }
      </Alert>
    </Snackbar>
  )
}

MySnackbar.propTypes = {
  message: PropTypes.string.isRequired,
  resetMessage: PropTypes.func.isRequired,
}