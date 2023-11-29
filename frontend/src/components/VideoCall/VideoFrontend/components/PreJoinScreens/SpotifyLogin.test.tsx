import { ChakraProvider } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import SpotifyLogin from './SpotifyLogin';
import React from 'react';

export function wrappedTownSelection() {
  return (
    <ChakraProvider>
      <SpotifyLogin />
    </ChakraProvider>
  );
}

describe('Spotify Login UI', () => {

  beforeEach(() => {  
    // mock the environment variable that is normally set
    process.env.NEXT_PUBLIC_TOWNS_SERVICE_URL = 'http://localhost:8080';
  });

  it('Should render the Spotify login UI section', () => {
    const { getByText } = render(wrappedTownSelection());
    expect(getByText('Spotify Capabilities')).toBeInTheDocument();
  });

  it('Should render the Spotify login button', () => {
    const { getByText } = render(wrappedTownSelection());
    expect(getByText('Login with Spotify')).toBeInTheDocument();
  });
});
