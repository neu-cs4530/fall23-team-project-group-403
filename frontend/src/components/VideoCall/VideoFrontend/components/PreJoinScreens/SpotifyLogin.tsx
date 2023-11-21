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

  const loginURL = `${process.env.NEXT_PUBLIC_TOWNS_SERVICE_URL}/auth/login`;

  return (
    <>
      <Heading p='4' as='h2' size='lg'>
        Spotify Capabilities
      </Heading>
      <Box>
        <Button>
          <a className='btn-spotify' href={loginURL}>
            Login with Spotify
          </a>
        </Button>
      </Box>
    </>
  );
}