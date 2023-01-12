import { Box, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';
import { Message } from './MessageLeft';

export default function MessageRight({ message }: Message) {
  return (
    <Stack direction="row" justifyContent="end">
      <Box
        sx={{
          inlineSize: '70%', overflowWrap: 'break-word', wordBreak: 'break-all', display: 'flex', justifyContent: 'end' 
        }}
      >
        <Typography variant="body1" sx={{ bgcolor: blue[500], padding: '.1rem 1rem', borderRadius: '20px', width: 'fit-content'}}>{message}</Typography>
      </Box>
    </Stack>
  );
}