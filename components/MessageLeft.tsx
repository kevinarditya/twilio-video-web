import { Box, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';

export type Message = {
  username: string,
  message: string,
  timestamp: string
}

export default function MessageLeft({ message }: Message) {
  return (
    <Stack direction="row">
      <Box
        sx={{
          inlineSize: '70%', overflowWrap: 'break-word', wordBreak: 'break-all', display: 'flex', justifyContent: 'start' 
        }}
      >
        <Typography variant="body1" sx={{ bgcolor: blue[200], padding: '.1rem 1rem', borderRadius: '20px', width: 'fit-content'}}>{message}</Typography>
      </Box>
    </Stack>
  );
}