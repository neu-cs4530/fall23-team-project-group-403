import { Box, Text, Heading, Input, VStack, StackDivider } from '@chakra-ui/react';
import { useState } from 'react';
import { Song } from '../../../hooks/useQueue';
import { useSpotify } from '../../../hooks/useSpotify';
import VolumeSlider from './VolumeSlider';

const SettingsDisplay = () => {
  const { searchForTrack, changeSpotifyVolume } = useSpotify();
  const [songResults, setSongResults] = useState<Song[] | null>(null);

  console.log(songResults);

  const handleKeyInput = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const searchResults = await searchForTrack(event.currentTarget.value);
    setSongResults(searchResults);
  };

  return (
    <Box>
      <Heading fontSize='l' as='h3' marginBottom={2}>
        Spotify Controls
      </Heading>

      <VStack
        spacing={5}
        borderColor='gray.500'
        alignItems={'stretch'}
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'>
        <Box>
          <Text>
            Search <Input onKeyUp={handleKeyInput} size='sm' />
          </Text>
          <Text> Search Results </Text>
        </Box>
        <VolumeSlider value={50} onChange={(sliderValue: number) => changeSpotifyVolume(sliderValue)} />
      </VStack>
    </Box>
  );
};

export default SettingsDisplay;
