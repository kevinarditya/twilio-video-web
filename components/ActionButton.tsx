import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

type IconButtonProps = {
  icon: ReactNode,
  children: string,
  onClick?: () => void
 }

function ActionButton({ icon, children, onClick }: IconButtonProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'color .3s ease-in-out',
        '&:hover': {
          cursor: 'pointer',
          color: blue[700],
        }
      }}
      onClick={onClick}
    >
      {icon}
      <Typography variant="body2">{children}</Typography>
    </Box>
  );
}

export default ActionButton;
