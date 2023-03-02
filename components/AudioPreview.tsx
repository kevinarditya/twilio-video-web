import React from 'react';
import { Item } from './ListItemPreview';
import { Box, Dialog, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material';
import { Delete, Download, MusicNote } from '@mui/icons-material';
import { invokeSaveAsDialog } from 'recordrtc';

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
  const { filename, timestamp, value, id } = metadata;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ListItem
      secondaryAction={
        <Stack direction="row">
          <Tooltip title="Download">
            <IconButton onClick={() => invokeSaveAsDialog(value as Blob, 'video-call-' + Date.now())}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      }
      disablePadding
    >
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
