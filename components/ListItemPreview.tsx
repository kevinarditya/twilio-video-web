import { Box, List, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import ImagePreview from "./ImagePreview";
import AudioPreview from './AudioPreview';
import VideoPreview from './VideoPreview';

export type Item = {
  id: string,
  type: string,
  filename: string,
  value: Blob,
  timestamp: string,
}

type ScreenshotPreviewProps = {
  items: Item[],
  handleDeleteItem?: (id: string) => void,
}

export default function ListItemPreview({ items, handleDeleteItem }: ScreenshotPreviewProps) {
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
        <List>
          {
            items.map((item) => {
              switch(item.type) {
                case 'audio':
                  return <AudioPreview key={item.id} metadata={item} onDelete={handleDeleteItem} />
                case 'video':
                  return <VideoPreview key={item.id} metadata={item} onDelete={handleDeleteItem} />
                default:
                  return <ImagePreview key={item.id} metadata={item} onDelete={handleDeleteItem} />
              }
            })
          }
        </List>
      </Box>
    </Stack>
  );
}
