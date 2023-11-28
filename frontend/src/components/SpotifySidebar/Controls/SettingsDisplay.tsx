import { Box, Text, Heading, Input, VStack, StackDivider } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../../../hooks/useQueue';
import { useSpotify } from '../../../hooks/useSpotify';
import useTownController from '../../../hooks/useTownController';
import VolumeSlider from './VolumeSlider';
import { useSongStatus } from '../../../hooks/useSongStatus';

const SettingsDisplay = () => {
  const { searchForTrack, changeSpotifyVolume } = useSpotify();
  const _ = useSongStatus();
  const coveyTownController = useTownController();
  const [songResults, setSongResults] = useState<Song[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  console.log(songResults);

  // Create a debounce function so we only send a new search API call after a time interval
  // This prevents us from sending a new API call for every key stroke
  const debounce = (func: () => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(func, delay);
    };
  };

  // Debounce search call, waits 300 ms before calling search API
  const debouncedSearch = debounce(async () => {
    const searchResults = await searchForTrack(inputRef.current?.value || '');
    setSongResults(searchResults);
  }, 300);

  const handleKeyInput = () => {
    debouncedSearch();
  };

  useEffect(() => {
    // Pause the town when the input is focused, we don't want to move while searching
    const handleFocusChange = () => {
      if (document.activeElement !== inputRef.current) {
        coveyTownController.unPause();
      } else {
        coveyTownController.pause();
      }
    };

    inputRef.current?.addEventListener('focus', handleFocusChange);
    inputRef.current?.addEventListener('blur', handleFocusChange);

    return () => {
      inputRef.current?.removeEventListener('focus', handleFocusChange);
      inputRef.current?.removeEventListener('blur', handleFocusChange);
    };
  }, [inputRef, coveyTownController]);

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
            Search <Input ref={inputRef} onKeyUp={handleKeyInput} size='sm' />
          </Text>
          <Text> Search Results </Text>
        </Box>
        <VolumeSlider value={50} onChange={(sliderValue: number) => changeSpotifyVolume(sliderValue)} />
      </VStack>
    </Box>
  );
};

export default SettingsDisplay;
