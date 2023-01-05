import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { ChangeEvent } from 'react';

type LobbyProps = {
  username: string,
  handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: () => void,
}

export default function Lobby({ username, handleUsernameChange, handleSubmit }: LobbyProps) {
  return (
    <Stack sx={{ height: '100vh' }} justifyContent="center" alignItems="center" spacing={3}>
      <Typography variant="h3">Join Video Call</Typography>
      <TextField
        id="room-username"
        label="Username"
        variant="outlined"
        value={username}
        onChange={handleUsernameChange}
        fullWidth
      />
      <Button disabled={username.length === 0} onClick={handleSubmit} variant="contained" fullWidth>Join</Button>
    </Stack>
  );
}