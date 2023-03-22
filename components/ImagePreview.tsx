import { InsertPhoto } from '@mui/icons-material';
import {
  Box,
  Dialog,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material';
import React from 'react';
import { Item } from "./ListItemPreview";
import ActionListItem from './ActionListItem';

type ImagePreviewProps = {
  metadata: Item,
}

type ImageDialogProps = {
  open: boolean,
  blob: Blob,
  onClose: () => void,
}

function ImageDialog({ open, blob, onClose }: ImageDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '.5rem'}}>
        <img src={URL.createObjectURL(blob)} alt="screenshot" />
      </Box>
    </Dialog>
  )
}

function ImagePreview({ metadata }: ImagePreviewProps) {
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
          <InsertPhoto />
        </ListItemIcon>
        <ListItemText primary={filename} secondary={timestamp} />
      </ListItemButton>
      <ListItemSecondaryAction>
        <ActionListItem metadata={metadata}/>
      </ListItemSecondaryAction>
      <ImageDialog open={open} blob={value as Blob} onClose={handleClose} />
    </ListItem>
  );
}

export default ImagePreview;
