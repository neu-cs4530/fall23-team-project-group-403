import { Heading, StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import QueueDisplay from './Queue/QueueDisplay';
import SettingsDisplay from './Controls/SettingsDisplay';
import { isEmpty } from 'lodash';

export default function SpotifySidebar(): JSX.Element {
  const spotifyToken = sessionStorage.getItem('SPOTIFY_AUTH_TOKEN');

  if (isEmpty(spotifyToken)) {
    return <></>;
  }

  return (
    <VStack
      align='left'
      spacing={5}
      border='2px'
      padding={2}
      marginLeft={2}
      borderColor='gray.500'
      height='100%'
      divider={<StackDivider borderColor='gray.200' />}
      borderRadius='4px'>
      <Heading fontSize='xl' as='h1'>
        Spotify Jukebox
      </Heading>
      <QueueDisplay />
      <SettingsDisplay />
    </VStack>
  );
}
