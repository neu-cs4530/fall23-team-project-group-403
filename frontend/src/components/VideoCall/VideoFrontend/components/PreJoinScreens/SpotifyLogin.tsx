import React from 'react';
import { Box, Button, Heading, Link } from '@chakra-ui/react';
import Check from '@material-ui/icons/Check';

export default function SpotifyLogin(): JSX.Element {
  const loginURL = `${process.env.NEXT_PUBLIC_TOWNS_SERVICE_URL}/auth/login`;
  const token = sessionStorage.getItem('SPOTIFY_AUTH_TOKEN');

  return (
    <Box borderWidth='1px' borderRadius='lg' my={2}>
      <Heading p='4' as='h2' size='lg'>
        Spotify Capabilities
      </Heading>
      <Box>
        <Link href={loginURL}>
          <Button className='btn-spotify' m={4}>
            Login with Spotify
          </Button>
        </Link>
        {token && <Check />}
      </Box>
    </Box>
  );
}
