import { Delete, Download } from '@mui/icons-material';
import { IconButton, Stack, Tooltip } from '@mui/material';
import React from 'react';
import { Item } from './ListItemPreview';

type ActionListItemProps = {
  metadata: Item,
  onDelete: (id: string) => void,
}

function ActionListItem({ metadata, onDelete }: ActionListItemProps) {
  const { filename, value, id } = metadata;

  const handleDownload = () => {
    const hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(value as Blob);
    hyperlink.download = filename;

    hyperlink.click();
  }

  const handleDeleteItem = () => {
      onDelete(id)
  };

  return (
    <Stack direction="row">
      <Tooltip title="Download">
        <IconButton onClick={handleDownload}>
          <Download />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={handleDeleteItem}>
          <Delete />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default ActionListItem;
