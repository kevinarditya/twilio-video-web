import { Box, Grid, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

type ScreenshotPreviewProps = {
  listScreenshot: any[]
}

export default function ScreenshotPreview({ listScreenshot }: ScreenshotPreviewProps) {
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
        sx={{ bgcolor: 'white', height: '100%', padding: '1rem 1rem', overflow: 'scroll' }}
      >
        <Grid container spacing={1} sx={{ height: '100%' }}>
          {
            listScreenshot.map((screenshot, index) => (
              <Grid key={index} item xs={12} md={4} xl={2}>
                <img src={screenshot} alt="screenshot" />
              </Grid>
            ))
          }
          <Grid item xs={12} md={4} xl={2}>
            <Box sx={{ height: '10rem', bgcolor: grey[300] }}></Box>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}