import { Box, Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function RoomNotFound() {
  return (
    <>
      <Box
        sx={{ height: '100vh' }}
      >
        <Stack sx={{ height: '100vh' }} direction="row" justifyContent="center" alignItems="center" >
          <Typography variant="h2">Room Not Found</Typography>
        </Stack>
      </Box>
    </>
  )
}