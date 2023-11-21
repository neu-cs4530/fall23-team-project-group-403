import { StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import QueueDisplay from './Queue/QueueDisplay';
import SettingsDisplay from './Controls/SettingsDisplay';
import SpotifyWebplayer from './SpotifyWebplayer';
import SongDisplay from './SongDisplay';

<<<<<<< HEAD
=======
const SONGS = [
  { id: '1', name: 'song1' },
  { id: '2', name: 'song2' },
  { id: '3', name: 'song3' },
];

>>>>>>> 429ae60213a3c20a7d7db1b82ef21846010a0195
export default function SpotifySidebar(): JSX.Element {
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
      <QueueDisplay />
      <SettingsDisplay />
<<<<<<< HEAD
      <SpotifyWebplayer token={window.sessionStorage.getItem('SPOTIFY_AUTH_TOKEN')} />
=======
      <SpotifyWebplayer token={window.sessionStorage.getItem('SPOTIFY_AUTH_TOKEN')}/>
>>>>>>> 429ae60213a3c20a7d7db1b82ef21846010a0195
    </VStack>
  );
}
