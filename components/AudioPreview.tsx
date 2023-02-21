import React from 'react';
import { Item } from './ListItemPreview';
import { Box, Dialog, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { MusicNote } from '@mui/icons-material';

type AudioPreviewProps = {
  metadata: Item
}

type AudioDialogProps = {
  open: boolean,
  blob: Blob,
  onClose: () => void,
}

function AudioDialog({ open, blob, onClose }: AudioDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '.5rem'}}>
        <audio controls autoPlay>
          <source src={URL.createObjectURL(blob)} type="audio/ogg"/>
        </audio>
      </Box>
    </Dialog>
  )
}

function AudioPreview({ metadata }: AudioPreviewProps) {
  const { filename, timestamp, value } = metadata;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemIcon>
          <MusicNote />
        </ListItemIcon>
        <ListItemText primary={filename} secondary={timestamp} />
      </ListItemButton>
      <AudioDialog open={open} blob={value as Blob} onClose={handleClose} />
    </ListItem>
  );
}

export default AudioPreview;
