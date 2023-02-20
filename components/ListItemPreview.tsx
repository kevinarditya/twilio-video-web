import { Box, Grid, List, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import ImagePreview from "./ImagePreview";

export type Item = {
  id: string,
  type: string,
  filename: string,
  value: string,
  timestamp: string,
}

type ScreenshotPreviewProps = {
  items: Item[]
}

export default function ListItemPreview({ items }: ScreenshotPreviewProps) {
  return (
    <Stack
      sx={{
        borderRadius: '10px',
        height: '100%',
        bgcolor: grey[600]
      }}
    >
      <Box sx={{ padding: '.5rem', borderBottom: '1px solid black' }}>
        <Typography variant="h6">List Item</Typography>
      </Box>
      <Box
        sx={{ bgcolor: 'white', height: '100%', padding: '1rem 1rem', overflow: 'scroll' }}
      >
        {/*<Grid container spacing={1} sx={{ height: '100%' }}>*/}
        {/*  {*/}
        {/*    items.map((item,) =>*/}
        {/*      <Grid key={item.id} item xs={12} md={4} xl={2}>*/}
        {/*        <img src={item.value} alt="screenshot" />*/}
        {/*      </Grid>*/}
        {/*    )*/}
        {/*  }*/}
        {/*  <Grid item xs={12} md={4} xl={2}>*/}
        {/*    <Box sx={{ height: '10rem', bgcolor: grey[300] }}></Box>*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}
        <List>
          {
            items.map((item) => (
              <ImagePreview key={item.id} metadata={item}/>
            ))
          }
        </List>
      </Box>
    </Stack>
  );
}
