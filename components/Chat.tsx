import { AttachFile, Send } from '@mui/icons-material';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { ChangeEvent, useCallback, useState } from 'react';
import MessageLeft, { Message } from './MessageLeft';
import MessageRight from './MessageRight';
import { v4 } from 'uuid';

type ChatProps = {
  username: string
}

export default function Chat({ username }: ChatProps) {
  const [message, setMessage] = useState<string>();
  const [messages, setMessages] = useState<Array<Message>>([]);

  const handleOnChangeMessage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(() => {
    const willMessage: Message = {
      username: username,
      message: message,
      timestamp: Date.now().toString(),
    };
    setMessages((prevState) => [...prevState, willMessage])
    setMessage('');
  }, [username, message])

  return (
    <Stack direction="column" justifyContent="end" sx={{ height: '100%' }}>
      <Box sx={{ borderBottom: '1px solid black', padding: '.5rem 0', bgcolor: grey[600], borderRadius: '10px 10px 0 0' }}>
        <Typography variant="h6" align="center">Chat</Typography>
      </Box>
      <Box
        sx={{ bgcolor: 'white', overflowY: 'scroll', flexGrow: 1, display: 'grid' }}
      >
        <Stack sx={{ maxHeight:'min-content', padding: '.5rem .5rem' }} justifyContent="end" spacing={1}>
          <MessageLeft message="Halo" username={username} timestamp="12/01/2022 10:17:00" />
          <MessageRight message="Halo" username={username} timestamp="12/01/2022 10:17:30" />
          <MessageRight message="Halo" username={username} timestamp="12/01/2022 10:17:30" />
          <MessageRight message="Halo" username={username} timestamp="12/01/2022 10:17:30" />
          <MessageLeft message="Halo" username={username} timestamp="12/01/2022 10:17:00" />
          <MessageLeft message="Halo" username={username} timestamp="12/01/2022 10:17:00" />
          <MessageLeft message="Halo" username={username} timestamp="12/01/2022 10:17:00" />
          <MessageLeft message="Halo" username={username} timestamp="12/01/2022 10:17:00" />
          {
            messages.map((m: Message) =>
              m.username === username ? <MessageRight key={v4()} message={m.message} username={m.username} timestamp={m.timestamp} /> : <MessageLeft key={v4()} message={m.message} username={m.username} timestamp={m.timestamp} />
            )
          }
        </Stack>
      </Box>
      <Stack direction="row" sx={{ bgcolor: grey[300], borderRadius: '0 0 10px 10px' }}>
        <TextField
          id="input-message"
          placeholder='Type a new message'
          variant="standard"
          size="small"
          sx={{ flexGrow: 1, borderRadius: '10px', padding: '0 .5rem', margin: '.8rem 0' }}
          value={message}
          onChange={handleOnChangeMessage}
        />
        <IconButton color="primary" aria-label="send" disabled={username === ''}>
          <AttachFile />
        </IconButton>
        <IconButton color="primary" aria-label="send" disabled={username === ''} onClick={handleSendMessage}>
          <Send />
        </IconButton>
      </Stack>
    </Stack>
  );
};
