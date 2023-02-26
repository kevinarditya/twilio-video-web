import React from 'react';
import { Stack, Typography } from '@mui/material';

type TimerProps = {
  time: number,
}
function Timer({ time }: TimerProps) {
  return (
    <Stack direction="row">
      <Typography variant="button">
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </Typography>
      <Typography variant="button">
        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
      </Typography>
      <Typography variant="button">
        {("0" + ((time / 10) % 100)).slice(-2)}
      </Typography>
    </Stack>
  );
}

export default Timer;
