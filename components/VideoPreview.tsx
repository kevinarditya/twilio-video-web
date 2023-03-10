import React from 'react';
import { Item } from './ListItemPreview';
import { Box, Dialog, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { VideoCall } from '@mui/icons-material';
import ActionListItem from './ActionListItem';

type VideoPreviewProps = {
  metadata: Item,
  onDelete: (id: string) => void,
}

type VideoDialogProps = {
  open: boolean,
  blob: Blob,
  onClose: () => void,
}

function VideoDialog({ open, blob, onClose }: VideoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '.5rem'}}>
        <video controls autoPlay>
          <source src={URL.createObjectURL(blob)} type="video/webm"/>
        </video>
      </Box>
    </Dialog>
  )
}
function VideoPreview({ metadata, onDelete }: VideoPreviewProps) {
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
          <VideoCall />
        </ListItemIcon>
        <ListItemText primary={filename} secondary={timestamp} />
      </ListItemButton>
      <ListItemSecondaryAction>
        <ActionListItem metadata={metadata} onDelete={onDelete} />
      </ListItemSecondaryAction>
      <VideoDialog open={open} blob={value as Blob} onClose={handleClose} />
    </ListItem>
  );
}

export default VideoPreview;
