import React from 'react';
import { Item } from './ListItemPreview';
import { Box, Dialog, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import ActionListItem from './ActionListItem';

type AudioPreviewProps = {
  metadata: Item,
  onDelete: (id: string) => void,
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

function AudioPreview({ metadata, onDelete }: AudioPreviewProps) {
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
      <ListItemSecondaryAction>
        <ActionListItem metadata={metadata} onDelete={onDelete} />
      </ListItemSecondaryAction>
      <AudioDialog open={open} blob={value as Blob} onClose={handleClose} />
    </ListItem>
  );
}

export default AudioPreview;
