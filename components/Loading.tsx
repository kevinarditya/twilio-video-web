import { CssBaseline, Box, Stack, CircularProgress } from '@mui/material';
import React from 'react';

export default function Loading() {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{ height: '100vh' }}
      >
        <Stack sx={{ height: '100vh' }} direction="row" justifyContent="center" alignItems="center" >
          <CircularProgress />
        </Stack>
      </Box>
    </>
  )
}
