import { Delete, Download, Upload } from '@mui/icons-material';
import { Box, CircularProgress, CircularProgressProps, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Item } from './ListItemPreview';
import axios, { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { deleteFile } from '../redux/reducers/filesSlice';

type ActionListItemProps = {
  metadata: Item,
}

type ServerError = { errorMessage: string };

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}


function ActionListItem({ metadata }: ActionListItemProps) {
  const { filename, value, id, type } = metadata;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const [isUploading ,setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const handleDownload = () => {
    const hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(value as Blob);
    hyperlink.download = filename;

    hyperlink.click();
  }

  const handleDeleteItem = () => {
    dispatch(deleteFile(id));
  };

  const handleUpload = async () => {
    try {
      const response = await axios.get<string>(serverUrl + '/upload/pre-signed', { params: { filename: getFilePath() + filename + getFileExtension() } })
      const preSignedUploadUrl = response.data;

      setUploading(true);
      await axios.put(preSignedUploadUrl, value, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((100 * progressEvent.loaded) / progressEvent.total)
          setProgress(progress);
        }
      });
      setUploading(false);
    } catch(error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>;
        if (serverError && serverError.response) {
          console.log(error.response.status);
        }
        setUploading(false)
      }
    }
  }

  const getFileExtension = () => {
    switch(type) {
      case 'audio':
        return '.ogg'
      case 'video':
        return '.webm'
      default:
        return '.png'
    }
  }

  const getFilePath = () => {
    switch(type) {
      case 'audio':
        return 'audio/'
      case 'video':
        return 'video/'
      default:
        return 'screenshot/'
    }
  }

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
      {
        isUploading ? (
          <CircularProgressWithLabel  value={progress}/>
        ) : (
          <Tooltip title="upload">
            <IconButton onClick={handleUpload}>
              <Upload />
            </IconButton>
          </Tooltip>
        )
      }
    </Stack>
  );
}

export default ActionListItem;
