import React, { useCallback, useEffect, useState } from 'react';
import assert from 'assert';
import {
  Box,
  Button,
  Heading,
  useToast,
} from '@chakra-ui/react';

export default function SpotifyLogin(): JSX.Element {
  const toast = useToast();

  function handleLogin() {}

  return (
    <>
      <Heading p='4' as='h2' size='lg'>
        Spotify Capabilities
      </Heading>
      <Box>
        <Button
          onClick={handleLogin}>
          Log in
        </Button>
      </Box>
    </>
  );
}