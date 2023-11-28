import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';

export default function SpotifyLogin(): JSX.Element {
  const loginURL = `${process.env.NEXT_PUBLIC_TOWNS_SERVICE_URL}/auth/login`;

  return (
    <Box borderWidth='1px' borderRadius='lg' my={2}>
      <Heading p='4' as='h2' size='lg'>
        Spotify Capabilities
      </Heading>
      <Box>
        <Button m={4}>
          <a className='btn-spotify' href={loginURL}>
            Login with Spotify
          </a>
        </Button>
      </Box>
    </Box>
  );
}
