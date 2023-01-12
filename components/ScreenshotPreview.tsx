import { Box, Grid, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

export default function ScreenshotPreview() {
  return (
    <Stack
      sx={{
        borderRadius: '10px',
        height: '100%',
        bgcolor: grey[600]
      }}
    >
      <Box sx={{ padding: '.5rem', borderBottom: '1px solid black' }}>
        <Typography variant="h6">Screenshot Preview</Typography>
      </Box>
      <Box
        sx={{ bgcolor: 'white', height: '100%', padding: '1rem 1rem' }}
      >
        <Grid container spacing={1} sx={{ height: '100%' }}>
          <Grid item xs={12} md={4} xl={2}>
            <Box sx={{ height: '15rem', bgcolor: grey[300] }}></Box>
          </Grid>
          <Grid item xs={12} md={4} xl={2}>
            <Box sx={{ height: '15rem', bgcolor: grey[300] }}></Box>
          </Grid>
          <Grid item xs={12} md={4} xl={2}>
            <Box sx={{ height: '15rem', bgcolor: grey[300] }}></Box>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}